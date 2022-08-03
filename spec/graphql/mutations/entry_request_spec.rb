# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest do
  describe 'creating an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_create_entry_request])
    end

    let!(:user) do
      create(:user_with_community, user_type: 'visitor', role: visitor_role)
    end
    let!(:admin) do
      create(:user, user_type: 'admin', community_id: user.community_id, role: admin_role)
    end
    let(:query) do
      <<~GQL
        mutation CreateEntryRequest(
          $name: String!
          $reason: String!
          $temperature: String
          $email: String
          ) {
          result: entryRequestCreate(
            name: $name
            reason: $reason
            temperature: $temperature
            email: $email
          ) {
            entryRequest {
              id
              name
              email
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
        email: 'john@xyz.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'email')).to eql 'john@xyz.com'
      expect(result['errors']).to be_nil
    end

    it 'returns Unauthorized for non Unauthorized users' do
      variables = {
        name: 'Mark Percival',
        reason: 'Visiting',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'if temperature is provided it should create a user_temp event' do
      variables = {
        name: 'Mark Percival',
        reason: 'Visiting',
        temperature: '30',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      ref_id = result.dig('data', 'result', 'entryRequest', 'id')
      log = Logs::EventLog.find_by(ref_id: ref_id)
      expect(log.ref_type).to eql 'Logs::EntryRequest'
      expect(log.data['note']).to eql '30'
      expect(log.subject).to eql 'user_temp'
      expect(result['errors']).to be_nil
    end
  end

  describe 'updating an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_update_entry_request])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:random_user) { create(:user_with_community, role: visitor_role) }
    let!(:entry_request) do
      user.entry_requests.create(name: 'Mark Percival', reason: 'Visiting', is_guest: true)
    end

    let(:query) do
      <<~GQL
        mutation UpdateEntryRequest($id: ID!, $name: String, $email: String) {
          result: entryRequestUpdate(id: $id, name: $name, email: $email) {
            entryRequest {
              id
              name
              email
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
        email: 'john@xyz.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'name')).to eql 'Mark Smith'
      expect(result.dig('data', 'result', 'entryRequest', 'email')).to eql 'john@xyz.com'
      expect(result['errors']).to be_nil
    end

    it 'updates entry request when current user is owner' do
      variables = { id: entry_request.id, email: 'sample@gmail.com' }
      result = DoubleGdpSchema.execute(query,
                                       variables: variables,
                                       context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'email')).not_to be_nil
    end

    it 'returns anauthorized for non allowed users' do
      variables = {
        id: entry_request.id,
        name: 'Mark Smith',
        reason: 'Visiting',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: random_user,
                                                site_community: random_user.community,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).to be_nil
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
    it 'returns an error with wrong inputs' do
      variables = {
        name: 'Mark Smith',
        reason: 'Visiting',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).to be_nil
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'ID! was provided invalid value'
    end
  end

  describe 'denying an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_deny_entry])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

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

    it 'returns a denied entry request' do
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

    it 'returns Unauthorized for non Unauthorized users' do
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'returns not found when a request does not exist' do
      variables = {
        id: SecureRandom.uuid,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'EntryRequest not found'
    end

    it 'returns error when provided wrong inputs' do
      variables = {
        id: false,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'invalid value'
    end
  end

  describe 'granting an entry request' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_grant_entry])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:another_user) { create(:user, community_id: user.community_id, role: visitor_role) }
    let!(:entry_request) { admin.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }
    let!(:event) do
      user.generate_events('visitor_entry', entry_request, ref_name: entry_request.name)
    end
    let!(:contractor) { create(:contractor, community_id: user.community_id) }

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
        id: event.ref_id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'result', 'entryRequest', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'entryRequest', 'grantedState')).to eql 1
      expect(result['errors']).to be_nil
    end

    it 'returns Unauthorized for non Unauthorized users' do
      variables = {
        id: event.ref_id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: contractor,
                                                site_community: user.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'returns not found for wrong events' do
      variables = {
        id: SecureRandom.uuid,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'EntryRequest not found'
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
    let!(:contractor_role) { create(:role, name: 'contractor') }
    let!(:guard_role) { create(:role, name: 'security_guard') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: guard_role,
                          permissions: %w[can_add_entry_request_note])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:contractor) do
      create(:contractor, community_id: user.community_id,
                          role: contractor_role)
    end

    let!(:guard) { create(:security_guard, community_id: user.community_id, role: guard_role) }
    let!(:entry_request) { guard.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }
    let!(:event) do
      guard.generate_events('observation_log', entry_request)
    end

    let(:query) do
      <<~GQL
        mutation addObservationNote($id: ID,
        $note: String,
        $refType: String,
        $eventLogId: ID,
        $attachedImages: JSON) {
          entryRequestNote(id: $id,
          note: $note,
          refType: $refType,
          eventLogId: $eventLogId,
          attachedImages: $attachedImages) {
            event {
              id
              data
              refType,
              imageUrls
              entryRequest {
                id
                exitedAt
              }
            }
          }
        }
      GQL
    end

    it 'adds a note to an entry request' do
      image = ActiveStorage::Blob.create_and_upload!(
        io: File.open(Rails.root.join('spec/support/test_image.png')),
        filename: 'test_image.png',
        content_type: 'image/png',
      )
      variables = {
        id: entry_request.id,
        note: 'The vehicle was too noisy',
        refType: 'Logs::EntryRequest',
        attachedImages: [image],
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).not_to be_nil
    end

    it 'adds a note to an user entry' do
      variables = {
        id: contractor.id,
        note: 'The user',
        refType: 'Users::User',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).not_to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'refType')).to eql 'Users::User'
      expect(result.dig('data', 'entryRequestNote', 'event', 'data', 'note')).to include 'The user'
    end

    it 'adds a note without any entry' do
      variables = {
        id: nil,
        note: 'An ordinary note',
        refType: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'refType')).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'data', 'note')).to include(
        'An ordinary note',
      )
    end

    it 'returns an error when note is empty' do
      variables = {
        id: contractor.id,
        note: '',
        refType: 'Users::User',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'cannot be empty'
    end

    it 'updates a request with an exited_at when it\'s an exit note' do
      variables = {
        id: entry_request.id,
        note: 'Exited',
        refType: 'Logs::EntryRequest',
      }
      expect(entry_request.exited_at).to be_nil
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'id')).to_not be_nil
      expect(result.dig('data', 'entryRequestNote', 'event', 'entryRequest',
                        'exitedAt')).to_not be_nil
    end

    it 'returns Unauthorized for non admin and security_guard' do
      variables = {
        id: entry_request.id,
        note: 'The vehicle was too noisy',
        refType: 'Logs::EntryRequest',
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
