# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::InvitationCreate do
  describe 'create an invitation for a guest' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:visitor) do
      create(:user, user_type: 'visitor', email: 'u@admin.com', community_id: user.community_id)
    end
    let!(:entry_request) do
      community.entry_requests.create!(name: 'John Doe', reason: 'Visiting',
                                       guest_id: visitor.id, user: admin)
    end

    let(:invitation_create_mutation) do
      <<~GQL
        mutation invitationCreate(
            $guestId: ID
            $name: String
            $email: String
            $phoneNumber: String
            $visitationDate: String!
            $startsAt: String
            $endsAt: String
            $occursOn: [String!]
            $visitEndDate: String
        ) {
            invitationCreate(
            guestId: $guestId
            name: $name
            email: $email
            phoneNumber: $phoneNumber
            visitationDate: $visitationDate
            startsAt: $startsAt
            endsAt: $endsAt
            occursOn: $occursOn
            visitEndDate: $visitEndDate
            ) {
            entryTime {
                id
            }
            }
        }
      GQL
    end

    describe '#resolve' do
      context 'when guest does not exist' do
        it 'returns created invitation' do
          variables = {
            name: 'John Doe',
            email: 'email@test.com',
            phoneNumber: '9019201920319',
            visitationDate: '2021-10-10',
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
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'entryTime', 'id')).not_to be_nil
          expect(community.entry_times.count).to eql 1
          expect(community.entry_requests.count).to eql 2
          expect(community.users.count).to eql 4
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end

        it 'returns an error when an email aready exist' do
          variables = {
            name: 'John Doe',
            email: 'user@admin.com',
            phoneNumber: '9019201920319',
            visitationDate: '2021-10-10',
          }

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'entryTime', 'id')).to be_nil
        end
      end
      context 'when guest already exists' do
        it 'returns an updated invitation' do
          variables = {
            name: 'John Doe',
            visitationDate: '2021-10-10',
            guestId: entry_request.guest_id,
          }

          expect(community.entry_times.count).to eql 0
          expect(community.entry_requests.count).to eql 1
          expect(community.users.count).to eql 3

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'entryTime', 'id')).not_to be_nil
          # it should just update existing records
          expect(community.users.count).to eql 3
          expect(community.entry_requests.count).to eql 1
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end

        it 'returns an updated invitation when no entry request' do
          variables = {
            name: 'John Doe',
            visitationDate: '2021-10-10',
            guestId: user.id,
          }

          expect(community.entry_times.count).to eql 0
          expect(community.entry_requests.count).to eql 1
          expect(community.users.count).to eql 3

          result = DoubleGdpSchema.execute(invitation_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'invitationCreate', 'entryTime', 'id')).not_to be_nil
          expect(community.users.count).to eql 3
          expect(community.entry_requests.count).to eql 2
          expect(admin.invitees.count).to eql 1
          expect(result.dig('errors', 0, 'message')).to be_nil
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin, security_guard' do
        it 'raises unauthorized error' do
          variables = {
            name: 'John Doe',
            email: 'user@admin.com',
            phoneNumber: '9019201920319',
            visitationDate: '2021-10-10',
          }
          result = DoubleGdpSchema.execute(invitation_create_mutation,
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
