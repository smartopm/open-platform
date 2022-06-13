# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Post do
  describe 'get all posts related to discussion' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:resident_role) { create(:role, name: 'resident') }
    let!(:admin_permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_view_posts])
    end
    let!(:resident_permission) do
      create(:permission, module: 'discussion',
                          role: resident_role,
                          permissions: %w[can_view_posts])
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
    let(:community_news_discussion) do
      create(:discussion, community: community,
                          title: 'Community News', user_id: admin.id)
    end
    let!(:community_news_post) do
      create(:post, community: community, content: 'Community News post',
                    discussion: community_news_discussion, user: admin)
    end

    let!(:admin_post) do
      create(:post,
             community: community,
             discussion: discussion,
             user: admin,
             accessibility: 'admins')
    end
    let!(:resident_post) do
      create(:post,
             community: community,
             discussion: discussion,
             user: resident)
    end
    let(:query) do
      <<~GQL
        query DisucssionPosts($discussionId: ID!) {
          discussionPosts(discussionId: $discussionId) {
            content
          }
        }
      GQL
    end

    let(:community_news_query) do
      <<~GQL
        query CommunityNewsPosts {
          communityNewsPosts {
            content
          }
        }
      GQL
    end

    describe '#discussion_posts' do
      context 'when user is admin' do
        it 'retrieves list of all posts' do
          variables = { discussionId: discussion.id }
          result = DoubleGdpSchema.execute(query, variables: variables,
                                                  context: {
                                                    current_user: admin,
                                                    site_community: community,
                                                  }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'discussionPosts', 0, 'content')).to eql 'New Post'
          expect(result.dig('data', 'discussionPosts').length).to eql 2
        end
      end

      context 'when user is resident' do
        it 'retrieves posts that are accessible to everyone' do
          variables = { discussionId: discussion.id }
          result = DoubleGdpSchema.execute(query, variables: variables,
                                                  context: {
                                                    current_user: resident,
                                                    site_community: community,
                                                  }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'discussionPosts').length).to eql 1
        end
      end

      context 'when discussion is not found' do
        it 'raises discussion not found error' do
          variables = { discussionId: '1234' }
          result = DoubleGdpSchema.execute(query, variables: variables,
                                                  context: {
                                                    current_user: admin,
                                                    site_community: community,
                                                  }).as_json
          expect(result['errors']).to_not be nil
          expect(result.dig('errors', 0, 'message')).to eql 'Discussion not found'
        end
      end

      context 'when user is unauthorized' do
        it 'raises unauthorized error' do
          variables = { discussionId: discussion.id }
          result = DoubleGdpSchema.execute(query, variables: variables,
                                                  context: {
                                                    current_user: user,
                                                    site_community: community,
                                                  }).as_json
          expect(result['errors']).to_not be nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe '#community news discussion_posts' do
      context 'when user is authorized' do
        it 'retrives list of community posts' do
          result = DoubleGdpSchema.execute(community_news_query, variables: {},
                                                                 context: {
                                                                   current_user: admin,
                                                                   site_community: community,
                                                                 }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'communityNewsPosts', 0, 'content'))
            .to eql 'Community News post'
        end
      end

      context 'when user is unauthorized' do
        it 'raises unauthorized error' do
          variables = { discussionId: discussion.id }
          result = DoubleGdpSchema.execute(query, variables: variables,
                                                  context: {
                                                    current_user: user,
                                                    site_community: community,
                                                  }).as_json
          expect(result['errors']).to_not be nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
