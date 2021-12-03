# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::SubstatusLog::SubstatusLogUpdate do
  describe 'update a substatus log' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:substatus_log) do
      create(:substatus_log, community_id: user.community_id,
                             user_id: user.id,
                             start_date: 'Fri, 10 Sep 2021 22:39:14 CAT +02:00',
                             stop_date: 10.days.from_now,
                             updated_by_id: admin.id)
    end

    let(:substatus_mutation) do
      <<~GQL
        mutation updateSubStatus($id: ID!, $userId: ID!, $startDate: String!) {
          substatusLogUpdate(id: $id, userId: $userId, startDate: $startDate){
            log {
              id
            }
          }
        }
      GQL
    end

    it 'updates a substatus log' do
      variables = {
        id: substatus_log.id,
        userId: user.id,
        startDate: 'Fri, 10 Sep 2021 22:39:14 CAT +02:00',
      }

      result = DoubleGdpSchema.execute(substatus_mutation, variables: variables,
                                                           context: {
                                                             current_user: admin,
                                                             site_community: admin.community,
                                                           }).as_json

      expect(result.dig('data', 'substatusLogUpdate', 'log', 'id')).to eql substatus_log.id
      expect(result['errors']).to be_nil
    end

    it 'records who made the update' do
      other_admin = create(:admin_user, community_id: user.community_id, role: admin.role)
      log = create(:substatus_log,
                   community_id: user.community_id,
                   user_id: user.id,
                   start_date: 'Fri, 10 Sep 2021 22:39:14 CAT +02:00',
                   stop_date: 10.days.from_now,
                   updated_by_id: admin.id)

      variables = {
        id: log.id,
        userId: user.id,
        startDate: 'Sat, 11 Sep 2021 22:39:14 CAT +02:00',
      }

      DoubleGdpSchema.execute(substatus_mutation, variables: variables,
                                                  context: {
                                                    current_user: other_admin,
                                                    site_community: other_admin.community,
                                                  }).as_json
      log.reload

      expect(log.updated_by_id).to eq(other_admin.id)
    end
  end
end
