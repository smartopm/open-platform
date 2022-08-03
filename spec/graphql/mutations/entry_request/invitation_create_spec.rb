# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::InvitationCreate do
  describe 'create an invitation for a guest' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:prospective_client_role) { create(:role, name: 'prospective_client') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_invite_guest])
    end

    let!(:user) do
      create(:user_with_community, user_type: 'prospective_client', role: prospective_client_role)
    end
    let!(:admin) do
      create(:admin_user, user_type: 'admin', community_id: user.community_id, role: admin_role)
    end
    let!(:community) { user.community }
    let!(:visitor) do
      create(:user, user_type: 'visitor', email: 'u@admin.com',
                    community_id: user.community_id, role: visitor_role)
    end
    let!(:entry_request) do
      community.entry_requests.create!(name: 'John Doe', reason: 'Visiting',
                                       guest_id: visitor.id, user: admin)
    end

    let(:invitation_create_mutation) do
      <<~GQL
        mutation invitationCreate(
            $visitationDate: String!
            $startsAt: String
            $endsAt: String
            $occursOn: [String!]
            $visitEndDate: String
            $guests: [JSON!]
            $userIds: [String!]
        ) {
            invitationCreate(
            visitationDate: $visitationDate
            startsAt: $startsAt
            endsAt: $endsAt
            occursOn: $occursOn
            visitEndDate: $visitEndDate
            guests: $guests
            userIds: $userIds
            ) {
            success
            }
        }
      GQL
    end

    describe '#resolve' do
      context 'when guest does not exist' do
        it 'returns created invitation' do
          variables = {
            userIds: [visitor.id],
            guests: [],
            visitationDate: '2021-10-10',
          }

          expect(community.entry_times.count).to eql 0
          expect(community.entry_requests.count).to eql 1
          expect(admin.invitees.count).to eql 0

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'success')).to eql true
          expect(community.entry_times.count).to eql 1
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end
      end
      context 'when guest already exists' do
        it 'returns an updated invitation' do
          variables = {
            guests: [],
            visitationDate: '2021-10-10',
            userIds: [entry_request.guest_id],
          }

          expect(community.entry_times.count).to eql 0
          expect(community.entry_requests.count).to eql 1
          expect(community.users.count).to eql 3

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'success')).to eql true
          # it should just update existing records
          expect(community.users.count).to eql 3
          expect(community.entry_requests.count).to eql 1
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end

        it 'returns an updated invitation when no entry request' do
          variables = {
            visitationDate: '2021-10-10',
            guests: [],
            userIds: [user.id],
          }

          expect(community.entry_times.count).to eql 0
          expect(community.entry_requests.count).to eql 1
          expect(community.users.count).to eql 3
          expect(admin.invitees.count).to eql 0

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'success')).to eql true
          expect(community.users.count).to eql 3
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end
      end

      context 'when user has no email or phone number' do
        it 'it should create invitations for multiple guests' do
          guests = [
            {
              firstName: 'John',
              lastName: 'Desdc',
              phoneNumber: '9232422312',
            },
            {
              firstName: 'some',
              lastName: 'other',
              phoneNumber: '43423323213',
            },
          ]
          variables = {
            guests: guests,
            visitationDate: '2021-10-10',
            userIds: [visitor.id],
          }

          expect(community.users.count).to eql 3
          expect(admin.invitees.count).to eql 0
          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(community.users.count).to eql 5
          expect(admin.invitees.count).to eql 3
          expect(community.users.find_by(name: 'John Desdc').user_type).to eql 'visitor'
          expect(community.users.find_by(name: 'some other').user_type).to eql 'visitor'
          expect(result.dig('data', 'invitationCreate', 'success')).to eql true
        end

        it 'it should create invitations with company names' do
          guests = [
            {
              firstName: '',
              companyName: 'some Xs',
              phoneNumber: '9232422312',
            },
            {
              companyName: 'some',
              lastName: '',
              phoneNumber: '43423323213',
            },
            {
              companyName: 'other',
              phoneNumber: '4342323213',
            },
          ]
          variables = {
            guests: guests,
            visitationDate: '2021-10-10',
            userIds: [],
          }

          expect(admin.invitees.count).to eql 0
          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(admin.invitees.count).to eql 3
          expect(community.entry_requests.find_by(company_name: 'some Xs')).not_to be_nil
          expect(community.entry_requests.find_by(company_name: 'other')).not_to be_nil
          expect(community.users.find_by(name: 'some').user_type).to eql 'visitor'
          expect(result.dig('data', 'invitationCreate', 'success')).to eql true
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard' do
        it 'raises unauthorized error' do
          variables = {
            guests: [],
            userIds: [],
            visitationDate: '2021-10-10',
          }
          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                             user_role: user.role,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
