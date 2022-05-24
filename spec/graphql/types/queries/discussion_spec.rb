# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Comment do
  describe 'comment queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_access_all_discussions])
    end

    let!(:current_user) { create(:user_with_community) }
    let!(:admin_user) do
      create(:admin_user, community_id: current_user.community_id,
                          role: admin_role)
    end

    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, status: 'valid',
                          community_id: current_user.community_id, post_id: '20')
    end
    let!(:another_user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end

    let(:discussions_query) do
      %(query {
              discussions {
                  id
                  title
                  postId
                }
        })
    end

    let(:discussion_post_query) do
      %(query {
          postDiscussion(postId:"#{user_discussion.post_id}") {
            title
            postId
            id
          }
        })
    end

    let(:discussion_query) do
      %(query {
            discussion(id: "#{user_discussion.id}") {
              title
              id
            }
        })
    end

    let(:top_discussion_topics_query) do
      %(query {
              topDiscussionTopics {
                  id
                  title
                }
        })
    end

    it 'should retrieve list of discussions' do
      result = DoubleGdpSchema.execute(discussions_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'discussions').length).to eql 1
      expect(result.dig('data', 'discussions', 0, 'id')).to eql another_user_discussion.id
      expect(result.dig('data', 'discussions', 0, 'postId')).to be_nil
      expect(result.dig('data', 'discussions', 0, 'title')).to include 'Community Discussion'
    end

    context 'when current user is not authorized to access all discussions' do
      it 'should raise unauthorized error' do
        result = DoubleGdpSchema.execute(discussions_query,
                                         context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    it 'should retrieve a discussion for a post id' do
      result = DoubleGdpSchema.execute(discussion_post_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'postDiscussion', 'id')).to eql user_discussion.id
      expect(result.dig('data', 'postDiscussion', 'postId')).to eql '20'
      expect(result.dig('data', 'postDiscussion', 'title')).to include 'Community Discussion'
    end

    it 'should retrieve single discussion' do
      result = DoubleGdpSchema.execute(discussion_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'discussion', 'id')).to eql user_discussion.id
      expect(result.dig('data', 'discussion', 'title')).to include 'Community Discussion'
    end

    it 'should retrieve list of top discussion topics only' do
      expected_topic = current_user
                        .community
                        .discussions
                        .create!(title: 'Safety', user_id: current_user.id)

      result = DoubleGdpSchema.execute(top_discussion_topics_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: current_user.community
                                        }).as_json

      expect(result.dig('data', 'topDiscussionTopics').length).to eql 1
      expect(result.dig('data', 'topDiscussionTopics', 0, 'id')).to eql expected_topic.id
      expect(result.dig('data', 'topDiscussionTopics', 0, 'title')).to eq expected_topic.title
    end
  end
end
