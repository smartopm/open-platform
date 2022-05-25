# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Log::LeadLogCreate do
  describe 'create lead log' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'lead_log',
                          role: admin_role,
                          permissions: %w[can_create_lead_log])
    end
    let(:lead_user) { create(:lead) }
    let(:community) { lead_user.community }
    let(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }

    let(:mutation) do
      <<~GQL
        mutation LeadLogCreate($logType: String!, $name: String, $userId: ID!, $amount: Float, $dealSize: Float, $investmentTarget: Float){
          leadLogCreate(name: $name, userId: $userId, logType:$logType, amount: $amount, dealSize: $dealSize, investmentTarget: $investmentTarget){
          success
          }
        }     
      GQL
    end

    context 'when event is created' do
      it 'creates event log' do
        variables = {
          userId: lead_user.id,
          logType: 'event',
          name: 'New event',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogCreate', 'success')).to eql true
      end
    end

    context 'when meeting is created' do
      it 'creates meeting log' do
        variables = {
          name: 'New meeting',
          logType: 'meeting',
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogCreate', 'success')).to eql true
      end
    end

    context 'when lead signs deal' do
      it 'creates signed_deal log' do
        variables = {
          name: 'Signed Deal',
          logType: 'signed_deal',
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogCreate', 'success')).to eql true
      end
    end

    context 'when deal details are provided' do
      it 'creates lead log' do
        variables = {
          name: 'Its deal',
          logType: 'deal_details',
          dealSize: 120_000,
          investmentTarget: 12,
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogCreate', 'success')).to eql true
      end
    end

    context 'when one of the deal attribute is blank' do
      it 'raises error' do
        variables = {
          name: 'Its deal',
          logType: 'deal_details',
          deal_size: 12_000,
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Deal details cannot be empty'
      end
    end

    context 'when investment are made for lead' do
      it 'creates lead log' do
        variables = {
          name: 'first investment',
          logType: 'investment',
          amount: 1200.0,
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'leadLogCreate', 'success')).to eql true
      end
    end

    context 'when user is unauthorized' do
      it 'throws unauthorized error' do
        variables = {
          name: 'New event',
          logType: 'event',
          userId: lead_user.id,
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
