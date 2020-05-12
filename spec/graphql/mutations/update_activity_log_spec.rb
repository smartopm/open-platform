# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::UpdateLog do
  describe 'update activity log' do
    let!(:user) { create(:user_with_community) }
    let!(:security_guard) { create(:security_guard, community_id: user.community_id) }
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
                                         current_user: security_guard,
                                       }).as_json

      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'refId'))
        .to eql entry_request.id
      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'data')).not_to be_nil
      expect(result.dig('data', 'activityLogUpdateLog', 'eventLog', 'data', 'enrolled'))
        .not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
end
