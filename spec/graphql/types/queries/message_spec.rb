# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Message do
  describe 'message' do
    let!(:current_user) { create(:user_with_community) }
    let!(:another_user) { create(:user_with_community, community_id: current_user.community_id) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }

    # rubocop:disable Metrics/LineLength
    # admin sends a message to current_user
    let!(:adm_cuser_msg) { create(:message, user_id: current_user.id, sender_id: admin.id, created_at: Time.now.utc - 3.minutes) }

    # according to Olivier, when the client send a message to an admin, the user_id is the same as the sender_id
    # current user replies to admin
    let!(:cuser_adm_msg) { create(:message, sender_id: current_user.id, user_id: current_user.id, created_at: Time.now.utc - 2.minutes) }

    # another user replies to admin
    let!(:auser_adm_msg) { create(:message, sender_id: another_user.id, user_id: another_user.id, created_at: Time.now.utc - 1.minute) }
    # rubocop:enable Metrics/LineLength
    let(:adm_msgs) do
      %(query {
        messages(limit: 10, offset: 0) {
          id
          message
          createdAt
          isRead
          user {
            id
          }
          sender {
            id
          }
        }
      })
    end

    let(:cuser_msgs) do
      %(query {
        userMessages(id:"#{current_user.id}") {
          id
          message
          createdAt
          user {
            id
          }
          sender {
            id
          }
        }
      })
    end

    let(:auser_msgs) do
      %(query {
        userMessages(id:"#{another_user.id}") {
          id
          message
          createdAt
          isRead
          user {
            id
          }
          sender {
            id
          }
        }
      })
    end

    it 'when admin retrieves mesg list it should have 2 entries' do
      result = DoubleGdpSchema.execute(adm_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 2
      expect(result.dig('data', 'messages', 0, 'id')).to eql auser_adm_msg.id
      expect(result.dig('data', 'messages', 1, 'id')).to eql cuser_adm_msg.id
      expect(result.dig('data', 'messages', 0, 'user', 'id')).to eql another_user.id
      expect(result.dig('data', 'messages', 1, 'user', 'id')).to eql current_user.id
      expect(result.dig('data', 'messages', 0, 'sender', 'id')).to eql another_user.id
      expect(result.dig('data', 'messages', 1, 'sender', 'id')).to eql current_user.id
    end

    it 'when user retrieves msg list' do
      result = DoubleGdpSchema.execute(cuser_msgs, context: { current_user: current_user }).as_json
      expect(result.dig('data', 'userMessages').length).to eql 2
      expect(result.dig('data', 'userMessages', 1, 'id')).to eql cuser_adm_msg.id
      expect(result.dig('data', 'userMessages', 1, 'sender', 'id')).to eql current_user.id
      expect(result.dig('data', 'userMessages', 1, 'user', 'id')).to eql current_user.id

      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: another_user }).as_json
      expect(result.dig('data', 'userMessages').length).to eql 1
      expect(result.dig('data', 'userMessages', 0, 'id')).to eql auser_adm_msg.id
      expect(result.dig('data', 'userMessages', 0, 'sender', 'id')).to eql another_user.id
      expect(result.dig('data', 'userMessages', 0, 'user', 'id')).to eql another_user.id
    end

    it 'should update messages with is_read status when non-admin user retrieves them' do
      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: another_user }).as_json
      expect(result.dig('data', 'userMessages', 0, 'isRead')).to eql true
    end
    it 'is_read status is not updated when admin queries messages' do
      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'userMessages', 0, 'isRead')).to eql false
    end
  end
end
