# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Comment do
  describe 'creating a Comment' do
    let!(:user) { create(:user_with_community) }
    let!(:user_discussion) do
      create(:discussion, user_id: user.id, community_id: user.community_id)
    end

    let(:query) do
      <<~GQL
        mutation commentCreate(
          $content: String!
          $discussionId: ID!
        ) {
            commentCreate(discussionId:$discussionId, content:$content){
                comment {
                id
                discussionId
                content
                userId
                }
            }
          }
      GQL
    end

    it 'returns a created Comment' do
      variables = {
        discussionId: user_discussion.id,
        content: 'This is your first and last comment',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'commentCreate', 'comment', 'id')).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment', 'content')).to include 'last comment'
      expect(result.dig('data', 'commentCreate', 'comment', 'userId')).to eql user.id
      expect(result.dig('data', 'commentCreate', 'comment', 'discussionId'))
        .to eql user_discussion.id
      expect(result.dig('errors')).to be_nil
    end

    it 'returns error when not supplied properly' do
      variables = {
        discussion_id: user_discussion.id,
        content: 'This is your first and last comment',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'commentCreate', 'comment', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'invalid value'
    end
  end
end
