# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::Add do
  describe 'user' do
    let!(:user) { create(:user_with_community) }
    let!(:reporting_user) { create(:user, community_id: user.community_id) }

    let!(:other_community_user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation AddActivityLogMutation($userId: ID!, $note: String) {
          activityLogAdd(userId: $userId, note: $note) {
            eventLog {
              actingUser {
                id
              }
              id
            }
          }
        }
      GQL
    end

    it 'returns should create an activity log' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'actingUser', 'id')).to eql user.id
    end

    it 'returns should not create an invalid activity log' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(
        query, variables: variables, context: {
          current_user: other_community_user,
        }
      ).as_json
      expect(result.dig('data', 'activityLogAdd')).to be_nil
      expect(result.dig('errors')).not_to be_empty
    end
  end
end
