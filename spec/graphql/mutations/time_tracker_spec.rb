# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Timesheet::TrackTime do
  describe 'track user time shift' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    # TODO: Add another user once implemented (a custodian)
    let(:query) do
      <<~GQL
        mutation($userId: ID!, $startDate: String, $endDate: String) {
          trackTime(userId: $userId, startDate: $startDate, endDate: $endDate){
            eventLog {
              data
              refId
              subject
            }
          }
        }
      GQL
    end

    it 'should record start and end date shift for a user' do
      variables = {
        userId: admin.id,
        startDate: '2020-04-21',
        endDate: '2020-04-22',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'trackTime', 'eventLog', 'refId')).to eql admin.id
      expect(result.dig('data', 'trackTime', 'eventLog', 'subject')).to eql 'user_shift'
      expect(result.dig('data', 'trackTime', 'eventLog', 'data', 'shift')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'should not record temperature when not authorized' do
      variables = {
        userId: user.id,
        startDate: '2020-04-21',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'trackTime', 'eventLog', 'refId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
