# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'create pending member' do
    let!(:current_user) { create(:user_with_community, user_type: 'security_guard') }
    let!(:user) { create(:user_with_community, user_type: 'client') }
    let!(:admin_user) { create(:user_with_community, user_type: 'admin') }

    let(:query) do
      <<~GQL
        mutation CreateUserMutation(
            $name: String!,
            $reason: String!,
            $vehicle: String,
            $phoneNumber: String!
            $userType: String!
            $email: String
          ) {
          userCreate(
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
              phoneNumber: $phoneNumber
              userType: $userType
              email: $email
            ) {
            user {
              id
              email
              phoneNumber
              requestReason
              name
              userType
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
        phoneNumber: '26923422232',
        userType: 'client',
        email: 'dummy@email.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userCreate', 'user', 'phoneNumber')).to eql '26923422232'
      expect(result.dig('data', 'userCreate', 'user', 'userType')).to eql 'client'
      expect(result['errors']).to be_nil
    end

    it 'returns  duplicate number' do
      variables = {
        name: 'Mark Percival',
        reason: 'Resident',
        vehicle: nil,
        phoneNumber: '26923422232',
        userType: 'client',
        email: 'dummy@email.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result['errors']).to be_nil
    end

    it 'returns should not create an invalid pending user' do
      variables = {
        name: '',
        reason: 'Resident',
        vehicle: nil,
        userType: 'client',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user')).to be_nil
      expect(result['errors']).not_to be_empty
    end

    it 'should not create a user when user_type is not valid' do
      variables = {
        name: 'Jels B',
        reason: 'Resident',
        vehicle: nil,
        phoneNumber: '26923422232',
        userType: nil,
        email: 'dummy@email.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user')).to be_nil
      expect(result['errors']).not_to be_empty
    end

    it 'should fail to create a duplicate email user' do
      dup_email = 'mark@doublegdp.com'
      create(:user, email: dup_email, community: current_user.community)
      variables = {
        name: 'Mark Percival',
        email: dup_email,
        reason: 'Resident',
        vehicle: nil,
        phoneNumber: '26924422232',
        userType: 'client',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userCreate', 'user')).to be_nil
      expect(result['errors']).not_to be_empty
    end

    it 'should allow clients to create other clients' do
      variables = {
        name: 'Mark John',
        reason: 'Resident',
        phoneNumber: '26913422232',
        userType: 'client',
        email: 'dummy@email.com',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin_user,
                                                site_community: admin_user.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      # expect(result.dig('data', 'userCreate', 'user', 'requestReason')).to eql 'Resident'
      expect(result.dig('data', 'userCreate', 'user', 'id')).not_to be_nil
      # expect(result.dig('data', 'userCreate', 'user', 'name')).to eql 'Mark John'
      # expect(result.dig('data', 'userCreate', 'user', 'userType')).to eql 'client'
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
            $reason: String,
            $userType: String!,
            $vehicle: String
            $subStatus: String
          ) {
          userUpdate(
              id: $id,
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
              userType: $userType
              subStatus: $subStatus
            ) {
            user {
              id
              requestReason
              userType
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
        userType: 'client',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'requestReason')).to eql 'Rspec'
      expect(result.dig('data', 'userUpdate', 'user', 'userType')).to eql 'client'
      expect(result['errors']).to be_nil
    end

    it 'returns should not update to an invalid pending user' do
      variables = {
        firstName: nil,
        lastName: 'Percival',
        reason: 'Rspec',
        vehicle: nil,
        userType: 'resident',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user')).to be_nil
      expect(result['errors']).not_to be_empty
    end
    it 'returns should not update without a user type' do
      variables = {
        firstName: nil,
        lastName: 'Perc',
        reason: 'Hs',
        vehicle: nil,
        userType: nil,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user')).to be_nil
      expect(result['errors']).not_to be_empty
    end

    it 'should create a substatus log' do
      variables = {
        id: current_user.id,
        name: 'joey',
        userType: 'admin',
        subStatus: 'floor_plan_purchased',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'userUpdate', 'user')).not_to be_nil
      status = ::SubstatusLog.find_by(user_id: current_user.id)
      expect(status.start_date).not_to be_nil
      expect(status.new_status).to eql 'floor_plan_purchased'
    end
  end

  describe 'updating a user' do
    let!(:admin) { create(:admin_user) }
    let!(:user) { create(:user_with_community) }
    let!(:security_guard) { create(:security_guard, community_id: admin.community_id) }
    let!(:pending_user) { create(:pending_user, community_id: admin.community_id) }
    let!(:client) { create(:pending_user, community_id: admin.community_id, user_type: 'client') }

    let(:query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $userType: String
            $vehicle: String
            $name: String
          ) {
          userUpdate(
              id: $id,
              userType: $userType,
              vehicle: $vehicle,
              name: $name
            ) {
            user {
              id
              userType
              roleName
              vehicle
              name
            }
          }
        }
      GQL
    end

    let(:user_merge_query) do
      <<~GQL
        mutation mergeUsers($id: ID!, $duplicateId: ID!){
          userMerge(id: $id, duplicateId: $duplicateId){
            success
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
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'roleName')).to eql 'Security Guard'
      expect(result['errors']).to be_nil
    end

    it 'should not update with restricted field' do
      variables = {
        id: pending_user.id,
        userType: 'visitor',
        name: 'Some nice name',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: client,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized Arguments'
    end

    it 'should not update when is client and record isnt theirs' do
      variables = {
        id: pending_user.id,
        name: 'Some nice name',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: client,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should update when it is user updating their own' do
      variables = {
        id: client.id,
        name: 'Some nice name',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: client,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result.dig('data', 'userUpdate', 'user', 'name')).to eql 'Some nice name'
      expect(result['errors']).to be_nil
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
                                                site_community: security_guard.community,
                                              }).as_json

      expect(result.dig('data', 'userUpdate', 'user', 'userType')).to eql nil
      expect(result['errors']).to_not be nil
    end

    it 'should merge the 2 given users' do
      variables = {
        id: security_guard.id,
        duplicateId: pending_user.id,
      }
      # remove all labels from user we are about to merge
      pending_user.user_labels.delete_all
      result = DoubleGdpSchema.execute(user_merge_query, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: admin.community,
                                                         }).as_json
      expect(result.dig('data', 'userMerge', 'success')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'should not merge the 2 new given users' do
      # because of initial labels given to users, there will be duplicates
      variables = {
        id: security_guard.id,
        duplicateId: pending_user.id,
      }

      result = DoubleGdpSchema.execute(user_merge_query, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: admin.community,
                                                         }).as_json
      expect(result.dig('data', 'userMerge', 'success')).to eql true
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'should not merge the 2 new given users' do
      # because of initial labels given to users, there will be duplicates
      variables = {
        id: security_guard.id,
      }
      result = DoubleGdpSchema.execute(user_merge_query, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: admin.community,
                                                         }).as_json
      expect(result.dig('data', 'userMerge', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'type ID! was provided invalid value'
    end

    it 'should not merge when current user is not admin' do
      variables = {
        id: security_guard.id,
        duplicateId: pending_user.id,
      }
      result = DoubleGdpSchema.execute(user_merge_query, variables: variables,
                                                         context: {
                                                           current_user: security_guard,
                                                           site_community: security_guard.community,
                                                         }).as_json
      expect(result.dig('data', 'userMerge', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should not merge when user is from a different community' do
      variables = {
        id: security_guard.id,
        duplicateId: pending_user.id,
      }
      result = DoubleGdpSchema.execute(user_merge_query, variables: variables,
                                                         context: {
                                                           current_user: user,
                                                           site_community: user.community,
                                                         }).as_json
      expect(result.dig('data', 'userMerge', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
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
            $vehicle: String,
            $email: String
            $avatarBlobId: String
            $phoneNumber: String!
            $userType: String!
          ) {
          userCreate(
              name: $name,
              requestReason: $reason,
              vehicle: $vehicle,
              avatarBlobId: $avatarBlobId,
              phoneNumber: $phoneNumber,
              email: $email,
              userType: $userType
            ) {
            user {
              id
              avatarUrl
              userType
            }
          }
        }
      GQL
    end

    let(:update_query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $avatarBlobId: String,
            $phoneNumber: String!
            $userType: String!
          ) {
          userUpdate(
              id: $id,
              avatarBlobId: $avatarBlobId,
              phoneNumber: $phoneNumber
              userType: $userType
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
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
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
        phoneNumber: '26923422232',
        email: 'name@email.com',
        userType: 'resident',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: admin.community,
                                                     }).as_json

      expect(result.dig('data', 'userCreate', 'user', 'avatarUrl')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should allow authorized users to attach avatars and documents' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      avatar_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        id: pending_user.id,
        avatarBlobId: avatar_blob.signed_id,
        phoneNumber: '26923422232',
        userType: 'resident',
      }
      result = DoubleGdpSchema.execute(update_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: admin.community,
                                                     }).as_json

      expect(result.dig('data', 'userUpdate', 'user', 'avatarUrl')).not_to be_nil
      expect(result['errors']).to be_nil
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
      expect(Sms).to receive(:send)
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: admin.community,
                                                            }).as_json
      expect(result.dig('data', 'result', 'success')).to be true
      expect(result['errors']).to be_nil
    end

    it 'should not allow non-admins to send one time login codes' do
      variables = {
        userId: resident.id,
      }
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: non_admin,
                                                              site_community: admin.community,
                                                            }).as_json
      expect(result.dig('data', 'result')).to be nil
      expect(result['errors']).not_to be_nil
    end
  end
end
