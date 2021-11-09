# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::EntryRequestUpdate do
  describe 'updates an entry request' do
    let!(:user) { create(:user_with_community, user_type: 'prospective_client') }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'John Doe', reason: 'Visiting') }

    let(:entry_request_update_mutation) do
      <<~GQL
        mutation EntryRequestUpdateMutation($id: ID!, $reason: String) {
          result: entryRequestUpdate(id: $id, reason: $reason) {
            entryRequest {
              id
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when entry request is present' do
        it 'returns created entry request' do
          variables = { id: entry_request.id, reason: 'Prospective Client' }
          result = DoubleGdpSchema.execute(entry_request_update_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
        end
      end

      context 'when entry request is not present' do
        it 'returns an error message' do
          variables = { id: '12344ghjk', reason: 'Prospective Client' }
          result = DoubleGdpSchema.execute(entry_request_update_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'EntryRequest not found'
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard' do
        it 'raises unauthorized error' do
          variables = { id: entry_request.id, reason: 'Prospective Client' }
          result = DoubleGdpSchema.execute(entry_request_update_mutation,
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
