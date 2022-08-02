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
    let(:log_type) { 'event' }
    let(:lead_log_name) { 'New event' }
    let(:amount) { 0.0 }
    let(:lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: log_type,
             name: lead_log_name,
             amount: amount)
    end

    let(:mutation) do
      <<~GQL
        mutation LeadLogUpdate($name: String, $id: ID!, $amount: Float){
          leadLogUpdate(name: $name, id: $id, amount: $amount){
            leadLog{
              logType
              name
              amount
            }
          }
        }     
      GQL
    end

    context 'when event is updated' do
      it 'updates event log' do
        variables = { id: lead_log.id, name: 'Event updated' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogUpdate', 'leadLog', 'name')).to eql 'Event updated'
      end
    end

    context 'when meeting is updated' do
      let(:log_type) { 'meeting' }
      let(:lead_log_name) { 'New meeting' }

      it 'updates meeting log' do
        variables = { id: lead_log.id, name: 'Annual Meeting' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogUpdate', 'leadLog', 'name')).to eql 'Annual Meeting'
      end
    end

    context 'when investment is updated' do
      let(:log_type) { 'investment' }
      let(:lead_log_name) { 'New investment' }
      let(:amount) { 120 }

      it 'updates investment log' do
        variables = { id: lead_log.id, amount: 150 }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogUpdate', 'leadLog', 'amount')).to eql 150.0
      end
    end

    context 'when user tries to update amount for lead log other than investment' do
      let(:amount) { 120 }

      it 'raises error' do
        variables = { id: lead_log.id, amount: 150 }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Cannot update the details'
      end
    end

    context 'when user tries to update other than event, meeting and investment' do
      let(:log_type) { 'signed_deal' }
      let(:lead_log_name) { 'New Deal' }

      it 'raises error' do
        variables = { name: 'Deal signed', id: lead_log.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Cannot update the details'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = { name: 'New event', id: lead_log.id }
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
