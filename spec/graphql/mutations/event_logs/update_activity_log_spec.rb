# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::UpdateLog do
  describe 'update activity log' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'Benje', reason: 'Passing through') }
    # since we no longer create an event after creating an entry, we can only check after grant!
    let!(:grant) { admin.grant!(entry_request.id) }

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
      expect(result['errors']).to be_nil
    end

    it 'should not update event log when not authorized' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: user,
                                       }).as_json

      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
