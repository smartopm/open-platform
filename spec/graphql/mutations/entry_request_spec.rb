# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest do
  describe 'creating an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation CreateEntryRequest($name: String!, $reason: String!) {
          result: entryRequestCreate(name: $name, reason: $reason) {
            entryRequest {
              id
              name
              user {
                id
              }
            }
          }
        }
      GQL
    end

    it 'returns a created entry request' do
      variables = {
        name: 'Mark Percival',
        reason: 'Visiting',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result['errors']).to be_nil
    end
  end

  describe 'updating an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation UpdateEntryRequest($id: ID!, $name: String) {
          result: entryRequestUpdate(id: $id, name: $name) {
            entryRequest {
              id
              name
            }
          }
        }
      GQL
    end

    it 'returns an updated entry request' do
      variables = {
        id: entry_request.id,
        name: 'Mark Smith',
        reason: 'Visiting',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'name')).to eql 'Mark Smith'
      expect(result['errors']).to be_nil
    end
  end

  describe 'denying an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation UpdateEntryRequest($id: ID!) {
          result: entryRequestDeny(id: $id) {
            entryRequest {
              id
              name
              grantedState
            }
          }
        }
      GQL
    end

    it 'returns a granted entry request' do
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'grantedState')).to eql 2
      expect(result['errors']).to be_nil
    end
  end

  describe 'acknowledging an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation EntryRequestAcknowledgeMutation($id: ID!) {
          result: entryRequestAcknowledge(id: $id) {
            entryRequest {
              id
              acknowledged
            }
          }
        }
      GQL
    end

    it 'returns an acknowledged entry request' do
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'acknowledged')).to eql true
      expect(result['errors']).to be_nil
    end
  end

  describe 'adding an observation note to an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:guard) { create(:security_guard, community_id: user.community_id) }
    let!(:contractor) { create(:contractor, community_id: user.community_id) }
    let!(:entry_request) { guard.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation addObservationNote($id: ID!, $note: String) {
          entryRequestNote(id: $id, note: $note) {
            event {
              id
            }
          }
        }
      GQL
    end

    it 'adds a note to an entry request' do
      variables = {
        id: entry_request.id,
        note: 'The vehicle was too noisy',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).not_to be_nil
    end

    it 'returns an error when entry does not exist' do
      variables = {
        id: SecureRandom.uuid,
        note: 'The vehicle was too noisy',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Entry request not found'
    end

    it 'returns an error when fields are not valid' do
      variables = {
        ids: entry_request.id,
        note: 'The vehicle was too noisy',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'type ID! was provided invalid value'
    end

    it 'returns Unauthorized for non admin and security_guard' do
      variables = {
        id: entry_request.id,
        note: 'The vehicle was too noisy',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: contractor,
                                                site_community: contractor.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
