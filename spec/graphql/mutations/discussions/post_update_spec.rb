# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion::PostUpdate do
  describe 'update post' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_update_post can_set_accessibility])
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
        mutation UpdatePost($id: ID!, $content: String, $accessibility: String) {
          postUpdate(id: $id, content: $content, accessibility: $accessibility){
            post {
              content
              accessibility
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
    context 'when user is not admin and updates accessibility' do
      it 'raises unauthorized error' do
        variables = {
          accessibility: 'admins',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: resident,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    context 'when current user is post author and post is accessible only to admins' do
      before { post.update(accessibility: 'admins') }

      it 'raises unauthorized error' do
        variables = {
          accessibility: 'everyone',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: resident,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    context 'when user is admin and updates accessibility' do
      it 'updates accessibility' do
        variables = {
          accessibility: 'admins',
          id: post.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postUpdate', 'post', 'accessibility')).to eql 'admins'
      end
    end

    context 'when accessibility provided is not valid' do
      it 'raises error' do
        variables = {
          id: post.id,
          accessibility: 'me',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        error_message = 'Accessibility is not included in the list'
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql error_message
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
