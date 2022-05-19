# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'create pending member' do
    let!(:lead_role) { create(:role, name: 'lead') }
    let!(:current_user) { create(:security_guard) }
    let!(:user) { create(:client, community: current_user.community) }
    let!(:admin_user) { create(:admin_user, community: current_user.community) }

    let(:query) do
      <<~GQL
        mutation CreateUserMutation(
            $name: String!,
            $reason: String,
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

    context 'when user type is lead' do
      it 'creates task for lead user' do
        variables = {
          name: 'Mark Test',
          phoneNumber: '26923422252',
          userType: 'lead',
          email: 'dummy@email.com',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: admin_user,
                                                  site_community: admin_user.community,
                                                }).as_json
        new_user = Users::User.find_by(email: 'dummy@email.com')
        expect(result['errors']).to be nil
        expect(admin_user.notes.count).to eql 1
        expect(new_user.tasks.count).to eql 1
      end
    end
  end

  describe 'update pending user' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_update_user_details])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }

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
  end

  describe 'updating a user' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:security_guard_role) { create(:role, name: 'security_guard') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_update_user_details can_merge_users])
    end
    let!(:admin) { create(:admin_user, role: admin_role, phone_number: '9988776655') }
    let!(:user) { create(:user, community: admin.community) }
    let!(:security_guard) do
      create(:security_guard, community_id: admin.community_id,
                              role: security_guard_role)
    end
    let!(:pending_user) do
      create(:pending_user, community_id: admin.community_id,
                            role: user.role, phone_number: '0909090909')
    end
    let!(:client) do
      create(:pending_user, community_id: admin.community_id,
                            user_type: 'client', role: client_role)
    end

    let(:query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $userType: String
            $vehicle: String
            $name: String!,
            $subStatus: String
            $phoneNumber: String
          ) {
          userUpdate(
              id: $id,
              userType: $userType,
              vehicle: $vehicle,
              name: $name,
              subStatus: $subStatus
              phoneNumber: $phoneNumber
            ) {
            user {
              id
              userType
              roleName
              vehicle
              name
              phoneNumber
            }
          }
        }
      GQL
    end

    let(:update_secondary_details_query) do
      <<~GQL
        mutation UpdateUserMutation(
            $id: ID!,
            $userType: String
            $vehicle: String
            $name: String!,
            $subStatus: String
            $phoneNumber: String
            $secondaryInfo: [JSON!]
          ) {
          userUpdate(
              id: $id,
              userType: $userType,
              vehicle: $vehicle,
              name: $name,
              subStatus: $subStatus
              phoneNumber: $phoneNumber
              secondaryInfo: $secondaryInfo
            ) {
            user {
              id
              userType
              roleName
              vehicle
              name
              phoneNumber
              contactInfos {
                id
                info
                contactType
              }
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
        name: 'Jane Doe',
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

    it 'should create user secondary information if not exists' do
      variables = {
        id: admin.id,
        name: 'Jane Doe',
        secondaryInfo: [
          { info: '123 Zoo Estate', contactType: 'address' },
          { info: '234980000000', contactType: 'phone' },
          { info: 'jane@doe.com', contactType: 'email' },
        ],
      }
      result = DoubleGdpSchema.execute(update_secondary_details_query,
                                       variables: variables,
                                       context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json
      expect(result.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(result['errors']).to be_nil

      user_contact_infos = result.dig('data', 'userUpdate', 'user', 'contactInfos')
      expect(user_contact_infos.size).to eq(3)
      expect(user_contact_infos.first['info']).to eq('123 Zoo Estate')
      expect(user_contact_infos.second['info']).to eq('234980000000')
      expect(user_contact_infos.last['info']).to eq('jane@doe.com')
    end

    it 'should update and delete contact infos correctly' do
      variables = {
        id: admin.id,
        name: 'Jane Doe',
        secondaryInfo: [
          { info: '123 Zoo Estate', contactType: 'address' },
          { info: '234980000000', contactType: 'phone' },
          { info: 'jane@doe.com', contactType: 'email' },
        ],
      }
      before_update = DoubleGdpSchema.execute(update_secondary_details_query,
                                              variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(before_update.dig('data', 'userUpdate', 'user', 'id')).not_to be_nil
      expect(before_update['errors']).to be_nil

      user_contact_infos = before_update.dig('data', 'userUpdate', 'user', 'contactInfos')
      expect(user_contact_infos.size).to eq(3)

      # Update / Delete Contact Infos
      user_contact_infos.first['id']
      variables_to_update = {
        id: admin.id,
        name: 'Jane Doe',
        secondaryInfo: [
          { info: '456 Ziks Estate', contactType: 'address', id: user_contact_infos.first['id'] },
          { info: 'admin@doe.com', contactType: 'email', id: user_contact_infos.last['id'] },
        ],
      }

      after_update = DoubleGdpSchema.execute(update_secondary_details_query,
                                             variables: variables_to_update,
                                             context: {
                                               current_user: admin,
                                               site_community: admin.community,
                                             }).as_json

      contact_infos_after_update = after_update.dig('data', 'userUpdate', 'user', 'contactInfos')
      expect(contact_infos_after_update.size).to eq(2)
      expect(contact_infos_after_update.first['info']).to eq('456 Ziks Estate')
      expect(contact_infos_after_update.last['info']).to eq('admin@doe.com')
    end

    context 'when a user in community exists with same phone number' do
      it 'is expected to raise error' do
        variables = {
          id: pending_user.id,
          name: 'Jane Doe',
          phoneNumber: '9988776655',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: admin,
                                                  site_community: admin.community,
                                                }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Phone Number has already been taken'
      end
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

    describe 'substatus change log' do
      let!(:permission) do
        create(:permission, module: 'user',
                            role: admin_role,
                            permissions: %w[can_update_user_details])
      end
      let!(:current_user) { create(:admin_user, community_id: user.community.id, role: admin_role) }

      let(:variables) do
        {
          id: user.id,
          name: 'joey',
          userType: 'client',
          subStatus: 'floor_plan_purchased',
        }
      end

      it 'should create a substatus log' do
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: user.community,
                                                }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'userUpdate', 'user')).not_to be_nil
        status = Logs::SubstatusLog.find_by(user_id: user.id)
        expect(status.start_date).not_to be_nil
        expect(status.new_status).to eql 'floor_plan_purchased'
      end

      it 'does not allow non admin users to edit sub_status' do
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: user,
                                                  site_community: user.community,
                                                }).as_json

        expect(result['errors']).not_to be_empty
        expect(result['errors'][0]['message']).to equal('Unauthorized Arguments')
      end

      it 'should not create Substatus Log without substatus change' do
        variables.delete(:subStatus)
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: user.community,
                                                }).as_json

        expect(result['errors']).to be_nil
        expect(Logs::SubstatusLog.count).to eq 0
      end

      it 'should create Substatus Log after user substatus is updated' do
        DoubleGdpSchema.execute(query, variables: variables,
                                       context: {
                                         current_user: current_user,
                                         site_community: user.community,
                                       }).as_json

        expect(Logs::SubstatusLog.count).to eq 1
        stop_date = Logs::SubstatusLog.first&.stop_date
        expect(stop_date).to be_nil
      end

      it 'updates SubstatusLog updated_by_id field' do
        DoubleGdpSchema.execute(query, variables: variables,
                                       context: {
                                         current_user: current_user,
                                         site_community: user.community,
                                       }).as_json

        substatus_log = Logs::SubstatusLog.last

        expect(substatus_log.updated_by_id).to eq(current_user.id)
      end

      it 'updates stop_date only when User changes to new_status' do
        DoubleGdpSchema.execute(query, variables: variables,
                                       context: {
                                         current_user: current_user,
                                         site_community: user.community,
                                       }).as_json
        variables[:subStatus] = 'building_permit_approved'
        DoubleGdpSchema.execute(query, variables: variables,
                                       context: {
                                         current_user: current_user,
                                         site_community: user.community,
                                       }).as_json

        expect(Logs::SubstatusLog.count).to eq 2
        substatus_log = Logs::SubstatusLog.find_by(stop_date: nil)
        expect(substatus_log).not_to be_nil
        expect(substatus_log.new_status).to eq 'building_permit_approved'
        expect(substatus_log.previous_status).to eq 'floor_plan_purchased'
      end
    end
  end

  describe 'creating avatars and adding them to the user' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_update_user_details])
    end
    let!(:admin) { create(:admin_user, role: admin_role) }

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
            $name: String!,
            $avatarBlobId: String,
            $phoneNumber: String!
            $userType: String!
          ) {
          userUpdate(
              id: $id,
              name: $name,
              avatarBlobId: $avatarBlobId,
              phoneNumber: $phoneNumber
              userType: $userType
            ) {
            user {
              id
              avatarUrl
            }
          }
        }
      GQL
    end

    it 'should allow authorized users to attach avatars and documents to new users' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      avatar_blob = ActiveStorage::Blob.create_and_upload!(
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
      avatar_blob = ActiveStorage::Blob.create_and_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        id: pending_user.id,
        name: 'Jane Doe',
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
end
