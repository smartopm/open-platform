# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Comment do
  describe 'comment queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let!(:user_comments) do
      current_user.comments.create(content: 'This is an awesome comment',
                                   discussion_id: user_discussion.id)
    end

    let(:comments_query) do
      %(query {
             comments(postId: "#{user_discussion.post_id}"){
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
          discussionPost(postId:"#{user_discussion.post_id}") {
            title
            postId
            id
          }
        })
    end

    it 'should retrieve list of comments' do
      result = DoubleGdpSchema.execute(comments_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'comments').length).to eql 1
      expect(result.dig('data', 'comments', 0, 'id')).to eql user_comments.id
      expect(result.dig('data', 'comments', 0, 'discussionId')).to eql user_discussion.id
      expect(result.dig('data', 'comments', 0, 'content')).to eql 'This is an awesome comment'
      expect(result.dig('data', 'comments', 0, 'user', 'id')).to eql current_user.id
    end

    it 'should retrieve list of discussions' do
      result = DoubleGdpSchema.execute(discussions_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'discussions').length).to eql 1
      expect(result.dig('data', 'discussions', 0, 'id')).to eql user_discussion.id
      expect(result.dig('data', 'discussions', 0, 'postId')).to eql '20'
      expect(result.dig('data', 'discussions', 0, 'title')).to include 'Community Discussion'
    end

  it 'should retrieve a discussion for a post id' do
      result = DoubleGdpSchema.execute(discussion_post_query,
                                       context: { current_user: current_user }).as_json
      expect(result.dig('data', 'discussionPost','id')).to eql user_discussion.id
      expect(result.dig('data', 'discussionPost','postId')).to eql '20'
      expect(result.dig('data', 'discussionPost','title')).to include 'Community Discussion'
    end
  end
end
