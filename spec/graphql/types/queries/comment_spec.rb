# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Comment do
  describe 'comment queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, status: 'valid',
                          community_id: current_user.community_id, post_id: '20')
    end
    let!(:another_user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let!(:user_comments) do
      current_user.comments.create(content: 'This is an awesome comment',
                                   discussion_id: user_discussion.id, status: 'valid')
    end
    let!(:other_comments) do
      current_user.comments.create(content: 'This is an awesome but deleted comment',
                                   discussion_id: user_discussion.id, status: 'deleted')
    end

    let(:comments_query) do
      %(query {
             postComments(postId: "#{user_discussion.post_id}"){
                content
                id
                discussionId
                user {
                    id
                }
            }
        })
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
    let(:discussion_comments_query) do
      %(query {
            discussComments(id: "#{user_discussion.id}") {
              content
              discussionId
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

    it 'should retrieve list of comments without deleted comments' do
      result = DoubleGdpSchema.execute(comments_query,
                                       context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'postComments').length).to eql 1
      expect(result.dig('data', 'postComments', 0, 'id')).to eql user_comments.id
      expect(result.dig('data', 'postComments', 0, 'discussionId')).to eql user_discussion.id
      expect(result.dig('data', 'postComments', 0, 'content')).to eql 'This is an awesome comment'
      expect(result.dig('data', 'postComments', 0, 'user', 'id')).to eql current_user.id
    end

    it 'should retrieve list of discussions' do
      result = DoubleGdpSchema.execute(discussions_query,
                                       context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'discussions').length).to eql 1
      expect(result.dig('data', 'discussions', 0, 'id')).to eql another_user_discussion.id
      expect(result.dig('data', 'discussions', 0, 'postId')).to be_nil
      expect(result.dig('data', 'discussions', 0, 'title')).to include 'Community Discussion'
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

    it 'should retrieve comments for discussion' do
      result = DoubleGdpSchema.execute(discussion_comments_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'discussComments', 0, 'id')).to eql user_comments.id
      expect(result.dig('data', 'discussComments').length).to eql 1
      expect(result.dig('data', 'discussComments', 0, 'discussionId')).to eql user_discussion.id
      expect(result.dig('data', 'discussComments', 0, 'content'))
        .to include 'This is an awesome comment'
    end
  end
end
