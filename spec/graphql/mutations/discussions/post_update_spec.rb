# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion::PostUpdate do
  describe 'update post' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_update_post])
    end

    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let!(:admin) do
      create(:admin_user, user_type: 'admin', community_id: community.id, role: admin_role)
    end
    let(:resident) do
      create(:user,
             user_type: 'resident',
             community_id: community.id,
             role: resident_role)
    end
    let(:discussion) { create(:discussion, community: community, user_id: admin.id) }
    let(:post) { create(:post, community: community, discussion: discussion, user: resident) }

    let(:mutation) do
      <<~GQL
        mutation UpdatePost($id: ID!, $content: String) {
          postUpdate(id: $id, content: $content){
            post {
              content
            }
          }
        }
      GQL
    end

    context 'when user is authorized and post is present' do
      it 'updates post' do
        variables = {
          content: 'New Post is updated',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postUpdate', 'post', 'content')).to eql 'New Post is updated'
      end
    end

    context 'when post is of current user' do
      it 'updates post' do
        variables = {
          content: 'New Post is updated',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: resident,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postUpdate', 'post', 'content')).to eql 'New Post is updated'
      end
    end

    context 'when post is not present' do
      it 'raises post not found error' do
        variables = {
          content: 'New post is updated',
          id: '1234',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Post not found'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = {
          content: 'New post is updated',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
