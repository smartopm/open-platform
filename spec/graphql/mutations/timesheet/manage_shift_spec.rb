# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Timesheet::ManageShift do
  describe 'track user time shift' do
    let!(:user) { create(:contractor) }
    let!(:community) { user.community }
    let!(:custodian) { create(:store_custodian, community_id: community.id) }

    let(:query) do
      <<~GQL
        mutation manageShift($userId: ID!, $eventTag: String!) {
          manageShift(userId: $userId, eventTag: $eventTag){
            timeSheet {
              id
            }
          }
        }
      GQL
    end

    it 'should record start and end date shift for a user' do
      variables = {
        userId: user.id,
        eventTag: 'shift_start',
        community_id: community.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json

      expect(result.dig('data', 'manageShift', 'timeSheet', 'id')).not_to be_nil
      ts = Users::TimeSheet.find(result.dig('data', 'manageShift', 'timeSheet', 'id'))

      expect(ts.user_id).to eql user.id
      expect(ts.shift_start_event_log.acting_user_id).to eql custodian.id
      expect(ts.shift_start_event_log.subject).to eql 'shift_start'
      expect(ts.started_at).not_to be_nil
      expect(ts.ended_at).to be_nil

      variables = {
        userId: user.id,
        eventTag: 'shift_end',
        community_id: community.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json

      expect(result.dig('data', 'manageShift', 'timeSheet', 'id')).not_to be_nil
      ts = Users::TimeSheet.find(result.dig('data', 'manageShift', 'timeSheet', 'id'))

      expect(ts.user_id).to eql user.id
      expect(ts.shift_start_event_log.acting_user_id).to eql custodian.id
      expect(ts.shift_end_event_log.acting_user_id).to eql custodian.id
      expect(ts.shift_start_event_log.subject).to eql 'shift_start'
      expect(ts.shift_end_event_log.subject).to eql 'shift_end'
      expect(ts.started_at).not_to be_nil
      expect(ts.ended_at).not_to be_nil
    end

    it 'a user should not start a shift ' do
      variables = {
        userId: custodian.id,
        eventTag: 'shift_start',
        community_id: community.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'manageShift', 'timeSheet', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should not start a shift if a user does not exist' do
      variables = {
        userId: SecureRandom.uuid,
        eventTag: 'shift_start',
        community_id: community.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json
      expect(result.dig('data', 'manageShift', 'timeSheet', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Could not find User'
    end
  end
end
