# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Timesheet::EndShift do
  describe 'end user time shift' do
    let!(:user) { create(:user_with_community) }
    let!(:custodian) { create(:store_custodian, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation($logId: ID!, $endDate: String!) {
          endShift(logId: $logId, endDate: $endDate){
            eventLog {
              data
              refId
              subject
            }
          }
        }
      GQL
    end

    it 'should not end shift when event is not found' do
      variables = {
        logId: SecureRandom.uuid,
        endDate: Time.zone.now.strftime('%Y-%m-%d'),
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json
      expect(result.dig('data', 'endShift', 'eventLog', 'refId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'EventLog not found'
    end

    it 'should not end a shift if a user is not a custodian' do
      data = {
        'shift' => { start_date: 2.hours.ago },
      }
      event = EventLog.create(
        subject: 'user_shift',
        acting_user: user,
        community: user.community,
        created_at: 2.hours.ago,
        data: data.as_json,
      )
      variables = {
        logId: event['id'],
        endDate: Time.zone.now.strftime('%Y-%m-%d'),
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'endShift', 'eventLog', 'refId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should end a shift if a user is a custodian and an event existed' do
      start_date = 2.hours.ago.strftime('%Y-%m-%d')
      end_date = Time.zone.now.strftime('%Y-%m-%d')
      data = {
        'shift' => { start_date: start_date },
      }
      event = EventLog.create(
        subject: 'user_shift',
        acting_user: custodian,
        community: custodian.community,
        created_at: 2.hours.ago,
        ref_id: custodian.id,
        data: data.as_json,
      )
      variables = {
        logId: event['id'],
        endDate: end_date,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: custodian,
                                              }).as_json
      expect(result.dig('data', 'endShift', 'eventLog', 'refId')).to eql custodian.id
      expect(result.dig('data', 'endShift', 'eventLog', 'data', 'shift')).not_to be_nil
      expect(result.dig('data', 'endShift', 'eventLog', 'data', 'shift',
                        'end_date')).to eql end_date
      expect(result.dig('data', 'endShift', 'eventLog', 'data', 'shift',
                        'start_date')).to eql start_date
      expect(result.dig('data', 'endShift', 'eventLog', 'subject')).to eql 'user_shift'
      expect(result.dig('errors')).to be_nil
    end
  end
end
