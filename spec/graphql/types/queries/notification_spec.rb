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
             seen_at: 34.hours.ago)
    end

    let(:unseen_notifications_query) do
      <<~GQL
        query{
          unseenNotifications{
            category
            description
            header
            seenAt
          }
        }
      GQL
    end

    let(:seen_notifications_query) do
      <<~GQL
        query{
          seenNotifications{
            category
            description
            header
            seenAt
          }
        }
      GQL
    end

    describe '#unseen_notifcations' do
      context 'when unseen notifications are fetched' do
        it 'retreives upto 24 hours prior unseen notifications' do
          result = DoubleGdpSchema.execute(unseen_notifications_query,
                                           context: { current_user: user,
                                                      site_community: community  }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'unseenNotifications').count).to eql 1
          expect(result.dig('data', 'unseenNotifications', 0, 'category')).to eql 'message'
          expect(result.dig('data', 'unseenNotifications', 0, 'seenAt')).to eql nil
        end
      end
    end

    describe '#seen_notifcations' do
      context 'when seen notifications are fetched' do
        before { message_notification.update(seen_at: Time.zone.now) }

        it 'retreives upto 24 hours prior seen notifications' do
          result = DoubleGdpSchema.execute(seen_notifications_query,
                                           context: { current_user: user,
                                                      site_community: community  }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'seenNotifications').count).to eql 1
          expect(result.dig('data', 'seenNotifications', 0, 'category')).to eql 'message'
          expect(result.dig('data', 'seenNotifications', 0, 'seenAt')).to_not be nil
        end
      end
    end

    context 'when current user is blank' do
      it 'raises unauthorized error' do
        result = DoubleGdpSchema.execute(seen_notifications_query,
                                         context: { current_user: '',
                                                    site_community: community }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
