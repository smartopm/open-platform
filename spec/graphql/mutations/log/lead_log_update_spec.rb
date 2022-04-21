# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Log::LeadLogUpdate do
  describe 'update lead log' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'lead_log',
                          role: admin_role,
                          permissions: %w[can_update_lead_log])
    end
    let(:lead_user) { create(:lead) }
    let(:community) { lead_user.community }
    let(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let(:lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: 'event',
             name: 'New event')
    end

    let(:mutation) do
      <<~GQL
        mutation LeadLogUpdate($name: String, $id: ID!){
          leadLogUpdate(name: $name, id: $id){
            leadLog{
              logType
              name
            }
          }
        }     
      GQL
    end

    context 'when event is updated' do
      it 'updates event log' do
        variables = {
          id: lead_log.id,
          name: 'Event updated',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogUpdate', 'leadLog', 'name')).to eql 'Event updated'
      end
    end

    context 'when user is unauthorized' do
      it 'throws unauthorized error' do
        variables = {
          name: 'New event',
          id: lead_log.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: lead_user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
