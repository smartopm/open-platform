# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion do
  describe 'creating a Discussion user record' do
    let!(:current_user) { create(:user_with_community) }
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let(:query) do
      <<~GQL
        mutation discussionUserCreate(
          $discussionId: ID!
        ) {
            discussionUserCreate(discussionId:$discussionId){
                    discussionUser {
                        userId
                        discussionId
                }
            }
          }
      GQL
    end

    it 'returns a Discussion user' do
      variables = {
        discussionId: user_discussion.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community
                                              }).as_json
      expect(result.dig('data', 'discussionUserCreate', 'discussionUser',
                        'userId')).to eql current_user.id
      expect(result.dig('data', 'discussionUserCreate', 'discussionUser',
                        'discussionId')).to eql user_discussion.id
      expect(result.dig('errors')).to be_nil
    end

    it 'returns error when not supplied properly' do
      variables = {
        discussionI: user_discussion.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'discussionUserCreate', 'discussionUser',
                        'id')).to be_nil
      expect(result.dig('errors', 0, 'message'))
        .to eql 'Variable discussionId of type ID! was provided invalid value'
    end
  end
end
