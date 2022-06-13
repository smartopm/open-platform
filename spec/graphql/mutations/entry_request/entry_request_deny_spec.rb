# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::EntryRequestDeny do
  describe 'deny an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_deny_entry])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:community) { user.community }
    let!(:entry_request) { admin.entry_requests.create(name: 'John Doe', reason: 'Visiting') }

    let(:entry_request_deny_mutation) do
      <<~GQL
        mutation EntryRequestDenyMutation($id: ID!) {
          result: entryRequestDeny(id: $id) {
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
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when event log is present of entry request' do
        it 'returns a denied entry request' do
          variables = { id: entry_request.id }
          result = DoubleGdpSchema.execute(entry_request_deny_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
          expect(result.dig('data', 'result', 'entryRequest', 'grantedState')).to eql 2
          expect(result['errors']).to be_nil
        end
      end

      context 'when entry request is not present' do
        it 'raises error' do
          variables = { id: '1234' }
          result = DoubleGdpSchema.execute(entry_request_deny_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result')).to be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'EntryRequest not found'
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard or custodian' do
        it 'raises unauthorized error' do
          variables = { id: entry_request.id }
          result = DoubleGdpSchema.execute(entry_request_deny_mutation,
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
