# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'create pending member' do
    let!(:current_user) { create(:user_with_community, user_type: 'security_guard') }

    let(:query) do
      <<~GQL
        mutation CreateUserMutation(
            $name: String!,
            $reason: String!,
            $vehicle: String
          ) {
          userCreate(
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
            ) {
            user {
              id
            }
          }
        }
      GQL
    end

    it 'returns should create a pending user' do
      variables = {
        name: 'Mark Percival',
        reason: 'Resident',
        vehicle: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'returns should not create an invalid pending user' do
      variables = {
        name: '',
        reason: 'Resident',
        vehicle: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user')).to be_nil
      expect(result.dig('errors')).not_to be_empty
    end
  end

  describe 'update pending user' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:pending_user) { create(:pending_user, community_id: current_user.community_id) }

    let(:query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $name: String!,
            $reason: String!,
            $vehicle: String
          ) {
          userUpdate(
              id: $id,
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
            ) {
            user {
              id
              requestReason
            }
          }
        }
      GQL
    end

    it 'returns should update a pending user' do
      variables = {
        id: pending_user.id,
        name: 'Mark Percival',
        reason: 'Rspec',
        vehicle: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'requestReason')).to eql 'Rspec'
      expect(result.dig('errors')).to be_nil
    end

    it 'returns should not update to an invalid pending user' do
      variables = {
        firstName: nil,
        lastName: 'Percival',
        reason: 'Rspec',
        vehicle: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user')).to be_nil
      expect(result.dig('errors')).not_to be_empty
    end
  end

  describe 'updating a user' do
    let!(:admin) { create(:admin_user) }
    let!(:security_guard) { create(:security_guard, community_id: admin.community_id) }
    let!(:pending_user) { create(:pending_user, community_id: admin.community_id) }

    let(:query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $userType: String
            $vehicle: String
          ) {
          userUpdate(
              id: $id,
              userType: $userType,
              vehicle: $vehicle,
            ) {
            user {
              id
              userType
              roleName
              vehicle
            }
          }
        }
      GQL
    end

    it 'should update the user' do
      variables = {
        id: pending_user.id,
        userType: 'security_guard',
        vehicle: 'Toyota Corolla',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'roleName')).to eql 'Security Guard'
      expect(result.dig('errors')).to be_nil
    end

    it 'returns prevent non-admins from updating protected user fields' do
      variables = {
        id: pending_user.id,
        vehicle: 'Toyota Corolla',
        userType: 'admin',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: security_guard,
                                              }).as_json

      expect(result.dig('data', 'userUpdate', 'user', 'userType')).to eql nil
      expect(result.dig('errors')).to_not be nil
    end
  end

  describe 'creating avatars and adding them to the user' do
    let!(:admin) { create(:admin_user) }
    let!(:pending_user) { create(:pending_user, community_id: admin.community_id) }

    let(:create_query) do
      <<~GQL
        mutation CreateUserMutation(
            $name: String!,
            $reason: String!,
            $vehicle: String
            $avatarBlobId: String
          ) {
          userCreate(
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
              avatarBlobId: $avatarBlobId,
            ) {
            user {
              id
              avatarUrl
            }
          }
        }
      GQL
    end

    let(:update_query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $avatarBlobId: String
          ) {
          userUpdate(
              id: $id,
              avatarBlobId: $avatarBlobId,
            ) {
            user {
              id
              avatarUrl
              documentUrl
            }
          }
        }
      GQL
    end

    it 'should allow authorized users to attach avatars and documents to new users' do
      file = fixture_file_upload(Rails.root.join('public', 'apple-touch-icon.png'), 'image/png')
      avatar_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        name: 'Mark Percival',
        reason: 'Resident',
        vehicle: nil,
        avatarBlobId: avatar_blob.signed_id,
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                     }).as_json

      expect(result.dig('data', 'userCreate', 'user', 'avatarUrl')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'should allow authorized users to attach avatars and documents' do
      file = fixture_file_upload(Rails.root.join('public', 'apple-touch-icon.png'), 'image/png')
      avatar_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        id: pending_user.id,
        avatarBlobId: avatar_blob.signed_id,
      }
      result = DoubleGdpSchema.execute(update_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                     }).as_json

      expect(result.dig('data', 'userUpdate', 'user', 'avatarUrl')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
  describe 'sending a user a one time passcode' do
    let!(:admin) { create(:admin_user) }
    let!(:non_admin) { create(:user, community_id: admin.community_id) }
    let!(:resident) { create(:user, community_id: admin.community_id) }

    let(:send_one_time_login) do
      <<~GQL
        mutation SendOneTimePasscode(
            $userId: ID!
          ) {
          result: oneTimeLogin(
              userId: $userId
            ) {
            success
          }
        }
      GQL
    end

    it 'should allow an admin to send a one time login code' do
      variables = {
        userId: resident.id,
      }
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                            }).as_json
      expect(result.dig('data', 'result', 'success')).to be true
      expect(result.dig('errors')).to be_nil
    end

    it 'should not allow non-admins to send one time login codes' do
      variables = {
        userId: resident.id,
      }
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: non_admin,
                                                            }).as_json
      expect(result.dig('data', 'result')).to be nil
      expect(result.dig('errors')).not_to be_nil
    end
  end
end
