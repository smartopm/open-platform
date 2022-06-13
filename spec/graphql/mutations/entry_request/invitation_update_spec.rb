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
                          permissions: %w[can_update_invitation])
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
    let!(:invite) { admin.invite_guest(user.id, entry_request.id) }
    let(:entry_time) do
      community.entry_times.create(visitable_id: invite.id, visitable_type: 'Logs::Invite')
    end

    let(:invitation_update_mutation) do
      <<~GQL
        mutation invitationUpdate(
            $inviteId: ID!
            $visitationDate: String
            $startsAt: String
            $endsAt: String
            $occursOn: [String!]
            $visitEndDate: String
            $status: String
        ) {
            invitationUpdate(
            inviteId: $inviteId
            visitationDate: $visitationDate
            startsAt: $startsAt
            endsAt: $endsAt
            occursOn: $occursOn
            visitEndDate: $visitEndDate
            status: $status
            ) {
            success
            }
        }
      GQL
    end

    describe '#resolve' do
      context 'when invite does not have entry time' do
        it 'creates entry time and update status' do
          variables = {
            inviteId: invite.id,
            visitationDate: Time.zone.now.to_s,
            startsAt: Time.zone.now.to_s,
            endsAt: (Time.zone.now + 5.hours).to_s,
            status: 'cancelled',
          }

          expect(community.entry_times.count).to eql 0

          result = DoubleGdpSchema.execute(invitation_update_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'invitationUpdate', 'success')).to eql true
          expect(community.entry_times.count).to eql 1
          expect(invite.reload.status).to eql 'cancelled'
        end
      end

      context 'when entry_time exists' do
        before { entry_time }

        it 'updates the entry time' do
          variables = {
            inviteId: invite.id,
            visitationDate: Time.zone.now.to_s,
            startsAt: Time.zone.now.to_s,
            endsAt: (Time.zone.now + 5.hours).to_s,
          }

          result = DoubleGdpSchema.execute(invitation_update_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'invitationUpdate', 'success')).to eql true
        end
      end

      context 'when invalid status is passed' do
        it 'raises error' do
          variables = {
            inviteId: invite.id,
            status: 'wrong',
          }

          result = DoubleGdpSchema.execute(invitation_update_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql "'wrong' is not a valid status"
        end
      end
    end

    describe '#authorized?' do
      context 'when current user has the permission to edit invite' do
        it 'raises unauthorized error' do
          variables = {
            inviteId: invite.id,
            visitationDate: '2021-10-10',
          }
          result = DoubleGdpSchema.execute(invitation_update_mutation,
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
