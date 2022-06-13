# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Notification::NotificationUpdate do
  describe 'update notification' do
    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:another_user) do
      create(:resident, name: 'Bunny', community: community)
    end
    let(:message) do
      create(:message, sender_id: another_user.id, user_id: user.id, category: 'sms')
    end
    let(:message_notification) do
      create(:notification,
             user_id: user.id,
             community_id: community.id,
             notifable_id: message.id,
             notifable_type: 'Notifications::Message',
             category: :message)
    end
    let(:mutation) do
      <<~GQL
        mutation NotificationUpdate($id: ID!){
          notificationUpdate(id: $id){
            success
          }
        }
      GQL
    end

    context 'when unseen notification is clicked' do
      it 'marks it seen' do
        variables = { id: message_notification.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'notificationUpdate', 'success')).to eql true
      end
    end

    context 'when seen notification is clicked' do
      before { message_notification.update(seen_at: Time.zone.now) }

      it 'does not update notification' do
        variables = { id: message_notification.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'notificationUpdate', 'success')).to eql false
      end
    end

    context "when another user tries to update someone's notifications" do
      it 'raises error' do
        variables = { id: message_notification.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: another_user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Notification not found'
      end
    end

    context 'when current user is blank' do
      it 'raise unauthorized error' do
        variables = { id: message_notification.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: '',
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
