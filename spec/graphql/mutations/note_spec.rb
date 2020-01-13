# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  describe 'creating an note' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation CreateNote($userId: ID!, $body: String!) {
          result: noteCreate(userId: $userId, body: $body) {
            note {
              id
              body
            }
          }
        }
      GQL
    end

    it 'returns a created entry request' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
end
