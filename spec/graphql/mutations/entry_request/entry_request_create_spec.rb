# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::EntryRequestCreate do
  describe 'revoke an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:entry_request_create_mutation) do
      <<~GQL
        mutation EntryRequestCreateMutation($name: String!, $reason: String) {
          result: entryRequestCreate(name: $name, reason: $reason) {
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
        it 'returns created entry request' do
          variables = { name: 'John Doe', reason: 'Visiting' }
          result = DoubleGdpSchema.execute(entry_request_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                           }).as_json
          expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
          expect(result.dig('data', 'result', 'entryRequest', 'reason')).to eq 'Visiting'
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard' do
        it 'raises unauthorized error' do
          variables = { name: 'John Doe', reason: 'Visiting' }
          result = DoubleGdpSchema.execute(entry_request_create_mutation,
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