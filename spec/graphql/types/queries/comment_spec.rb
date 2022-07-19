# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Comment do
  describe 'comment queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'comment',
                          role: admin_role,
                          permissions: %w[can_fetch_all_comments])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }

    let!(:admin_user) do
      create(:admin_user, community_id: current_user.community.id,
                          role: admin_role)
    end
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, status: 'valid',
                          community_id: current_user.community_id, post_id: '20')
    end
    let!(:another_user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let!(:discussion_post1) do
      current_user.posts.create(content: 'This is an awesome comment',
                                discussion_id: user_discussion.id,
                                status: 'active',
                                community_id: current_user.community_id)
    end
    let!(:discussion_post2) do
      current_user.posts.create(content: 'This is an awesome but deleted comment',
                                discussion_id: user_discussion.id, status: 'deleted')
    end
    let!(:user_comments) do
      current_user.comments.create(content: 'This is an awesome comment',
                                   discussion_id: user_discussion.id,
                                   status: 'valid',
                                   community_id: current_user.community_id)
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

    let(:discussion_comments_query) do
      %(query {
            discussComments(id: "#{user_discussion.id}") {
              content
              discussionId
              id
              imageUrl
            }
        })
    end

    let(:comment_query) do
      %(query {
        fetchComments {
              content
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
      expect(result.dig('data', 'postComments', 0, 'id')).to eql discussion_post1.id
      expect(result.dig('data', 'postComments', 0, 'discussionId')).to eql user_discussion.id
      expect(result.dig('data', 'postComments', 0, 'content')).to eql 'This is an awesome comment'
      expect(result.dig('data', 'postComments', 0, 'user', 'id')).to eql current_user.id
    end

    it 'should retrieve list of all comments' do
      result = DoubleGdpSchema.execute(comment_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('data', 'fetchComments').length).to eql 1
      expect(result.dig('data', 'fetchComments', 0, 'id')).to eql user_comments.id
      expect(result.dig('data', 'fetchComments', 0, 'content')).to eql 'This is an awesome comment'
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
