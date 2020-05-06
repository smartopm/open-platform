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
      expect(result.dig('errors')).to be_nil
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
      expect(result.dig('errors')).to be_nil
    end
  end

  describe 'granting an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation UpdateEntryRequest($id: ID!) {
          result: entryRequestGrant(id: $id) {
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
      expect(result.dig('data')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'returns no error for non-admin grants' do
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end

  describe 'denying an entry request' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

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
      expect(result.dig('errors')).to be_nil
    end

    it 'returns a error for non-admin grants' do
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
end
