# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest do
  describe 'creating and entry log' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation CreateEntryRequest($name: String, $reason: String) {
          result: entryRequestCreate(name: $name, reason: $reason) {
            entryRequest {
              id
              name
              user {
                id
              }
            }
          }
        }
      GQL
    end

    it 'returns should create an activity log' do
      variables = {
        name: "Mark Percival",
        reason: "Visiting",
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

  end
end
