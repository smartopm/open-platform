# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::UpdateLog do
  describe 'update activity log' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'Benje', reason: 'Passing through') }

    let(:query) do
      <<~GQL
            mutation activityLogUpdateLog {
            activityLogUpdateLog(refId:"#{entry_request.id}"){
                eventLog {
                    refId
                    data
                }
            }
        }
      GQL
    end

    it 'update the activity log' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: admin,
                                       }).as_json

      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'refId'))
        .to eql entry_request.id
      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'data')).not_to be_nil
      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'data', 'enrolled'))
        .not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'should not update event log when not authorized' do
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
