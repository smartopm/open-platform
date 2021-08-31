# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::EntryRequestGrant do
  describe 'grant an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'John Doe', reason: 'Visiting') }

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
                                           }).as_json

          expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
          expect(result.dig('data', 'result', 'entryRequest', 'grantedState')).to eql 1
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
          result = DoubleGdpSchema.execute(entry_request_grant_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
