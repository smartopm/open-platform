# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::SubstatusLog::SubstatusLogUpdate do
  describe 'update a substatus log' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:substatus_log) do
      create(:substatus_log, community_id: user.community_id,
                             user_id: user.id,
                             start_date: Time.zone.now,
                             stop_date: 10.days.from_now)
    end

    let(:substatus_mutation) do
      <<~GQL
        mutation update_subtatus {
          substatusLogUpdate(id:"#{substatus_log.id}", startDate:"#{5.days.from_now}", userId:"#{user.id}"){
            log {
              id
            }
          }
        }
      GQL
    end

    it 'updates a substatus log' do
      result = DoubleGdpSchema.execute(substatus_mutation,
                                       context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'substatusLogUpdate', 'log', 'id')).to eql substatus_log.id
      expect(result['errors']).to be_nil
    end
  end
end
