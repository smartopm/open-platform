# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::Add do
  describe 'user' do
    let!(:user) { create(:user_with_community) }
    let!(:reporting_user) { create(:user, community_id: user.community_id) }

    let!(:other_community_user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation AddActivityLogMutation($userId: ID!, $timestamp: String!, $digital: Boolean!, $note: String) {
          activityLogAdd(userId: $userId, timestamp: $timestamp, digital: $digital, note: $note) {
            eventLog {
              actingUser {
                id
              }
              data
              id
            }
          }
        }
      GQL
    end

    it 'returns should create an activity log' do
      variables = {
        userId: user.id,
        timestamp: (Time.now.to_f * 1000).floor.to_s,
        digital: true,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'actingUser', 'id')).to eql user.id
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'data')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'data', 'digital')).to eql true
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
