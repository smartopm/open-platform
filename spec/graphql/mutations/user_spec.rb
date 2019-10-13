# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'create pending member' do
    let!(:current_user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation CreatePendingUserMutation(
            $name: String!,
            $reason: String!,
            $vehicle: String
          ) {
          userCreatePending(
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
      expect(result.dig('data', 'userCreatePending', 'user', 'id')).not_to be_nil
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
      expect(result.dig('data', 'userCreatePending', 'user')).to be_nil
      expect(result.dig('errors')).not_to be_empty
    end
  end

  describe 'update pending user' do
    let!(:current_user) { create(:user_with_community) }
    let!(:pending_user) { create(:pending_user, community_id: current_user.community_id) }

    let(:query) do
      <<~GQL
        mutation UpdatePendingUserMutation(
            $id: ID!,
            $name: String!,
            $reason: String!,
            $vehicle: String
          ) {
          userUpdatePending(
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
      expect(result.dig('data', 'userUpdatePending', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdatePending', 'user', 'requestReason')).to eql 'Rspec'
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
      expect(result.dig('data', 'userUpdatePending', 'user')).to be_nil
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
          ) {
          userUpdate(
              id: $id,
              userType: $userType,
            ) {
            user {
              id
              userType
              roleName
            }
          }
        }
      GQL
    end

    it 'should update the user' do
      variables = {
        id: pending_user.id,
        userType: 'security_guard',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'roleName')).to eql 'Security Guard'
      expect(result.dig('errors')).to be_nil
    end

    it 'returns prevent non-admins from updating a user' do
      variables = {
        id: pending_user.id,
        userType: 'security_guard',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: security_guard,
                                              }).as_json

      expect(result.dig('data', 'userUpdate', 'user', 'id')).to be_nil
      expect(result.dig('errors')).not_to be_empty
      expect(result.dig('errors').map { |err| err['message'] }).to include('Unauthorized')
    end
  end
end
