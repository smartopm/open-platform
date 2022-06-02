# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Notification do
  describe 'notification queries' do
    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:another_user) do
      create(:resident, name: 'Bunny', community: community)
    end
    let(:message) do
      create(:message, sender_id: another_user.id, user_id: user.id, category: 'sms')
    end
    let(:old_message) do
      create(:message, sender_id: another_user.id, user_id: user.id, category: 'sms')
    end
    let!(:message_notification) do
      create(:notification,
             user_id: user.id,
             community_id: community.id,
             notifable_id: message.id,
             notifable_type: 'Notifications::Message',
             category: :message)
    end
    let!(:old_message_notification) do
      create(:notification,
             user_id: user.id,
             community_id: community.id,
             notifable_id: old_message.id,
             notifable_type: 'Notifications::Message',
             category: :message,
             seen_at: 12.hours.ago)
    end

    let(:query) do
      <<~GQL
        query{
          userNotifications{
            category
            description
            header
            seenAt
          }
        }
      GQL
    end

    let(:notifications_count) do
      <<~GQL
        query{
          notificationsCount
        }
      GQL
    end

    describe '#user_notifications' do
      context 'when notifications are fetched' do
        it 'retreives notifications' do
          result = DoubleGdpSchema.execute(query, context: {
                                             current_user: user,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'userNotifications').count).to eql 2
          expect(result.dig('data', 'userNotifications', 0, 'category')).to eql 'message'
          expect(result.dig('data', 'userNotifications', 0, 'seenAt')).to eql nil
          expect(result.dig('data', 'userNotifications', 1, 'category')).to eql 'message'
          expect(result.dig('data', 'userNotifications', 1, 'seenAt')).to_not be nil
        end
      end
    end

    describe '#notifications_count' do
      context 'when notifications are checked' do
        it 'retrieves notifications count' do
          result = DoubleGdpSchema.execute(notifications_count, context: {
                                             current_user: user,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'notificationsCount')).to eql 1
        end
      end
    end

    context 'when current user is blank' do
      it 'raises unauthorized error' do
        result = DoubleGdpSchema.execute(query, context: {
                                           current_user: '',
                                           site_community: community,
                                         }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
