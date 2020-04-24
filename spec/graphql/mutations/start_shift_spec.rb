# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Timesheet::StartShift do
  describe 'track user time shift' do
    let!(:user) { create(:user_with_community) }
    let!(:custodian) { create(:store_custodian, community_id: user.community_id) }

    # TODO: Add another user once implemented (a custodian)
    let(:query) do
      <<~GQL
        mutation($userId: ID!, $startDate: String!) {
          startShift(userId: $userId, startDate: $startDate){
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
        userId: custodian.id,
        startDate: '2020-04-21',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json
      expect(result.dig('data', 'startShift', 'eventLog', 'refId')).to eql custodian.id
      expect(result.dig('data', 'startShift', 'eventLog', 'subject')).to eql 'user_shift'
      expect(result.dig('data', 'startShift', 'eventLog', 'data', 'shift')).not_to be_nil
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
      expect(result.dig('data', 'startShift', 'eventLog', 'refId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should not start a shift if a user does not exist' do
      variables = {
        userId: SecureRandom.uuid,
        startDate: '2020-04-21',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json
      expect(result.dig('data', 'startShift', 'eventLog', 'refId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'User not found'
    end
  end
end
