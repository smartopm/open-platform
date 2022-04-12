# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::EntryRequestGrant do
  describe 'grant an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_grant_entry])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }
    let!(:community) { user.community }
    let!(:entry_request) { create(:entry_request, user: admin, guest_id: user.id) }

    let(:entry_request_grant_mutation) do
      <<~GQL
        mutation EntryRequestGrantMutation($id: ID!) {
          result: entryRequestGrant(id: $id) {
            entryRequest {
              id
              name
              phoneNumber
              nrc
              vehiclePlate
              reason
              otherReason
              concernFlag
              grantedState
              createdAt
              updatedAt
              grantedAt
            }
            status
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when event log is present of entry request' do
        it 'returns a granted entry request' do
          variables = { id: entry_request.id }
          result = DoubleGdpSchema.execute(entry_request_grant_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
          expect(result.dig('data', 'result', 'entryRequest', 'grantedState')).to eql 1
          expect(result.dig('data', 'result', 'status')).to eql 'success'
          expect(result['errors']).to be_nil
        end
      end

      context 'when entry request is not present' do
        it 'raises error' do
          variables = { id: '1234' }
          result = DoubleGdpSchema.execute(entry_request_grant_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result')).to be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'EntryRequest not found'
        end
      end

      context 'when guest is deactivated' do
        before { user.deactivated! }

        it 'should not grant entry to the guest' do
          variables = { id: entry_request.id }
          result = DoubleGdpSchema.execute(entry_request_grant_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result', 'status')).to eql 'denied'
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard or custodian' do
        it 'raises unauthorized error' do
          variables = { id: entry_request.id }
          result = DoubleGdpSchema.execute(entry_request_grant_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                             user_role: user.role,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
