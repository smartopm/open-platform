# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Message do
  describe 'message' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'messages',
                          role: admin_role,
                          permissions: %w[can_access_user_messages can_access_messages])
    end
    let!(:current_user) { create(:user_with_community) }
    let!(:role) { current_user.role }
    let!(:another_user) { create(:user, community_id: current_user.community_id, role: role) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, role: admin_role) }
    let!(:campaign) { create(:campaign, community_id: current_user.community_id) }
    # admin sends a message to current_user
    let!(:adm_cuser_msg) do
      create(:message, user_id: current_user.id, sender_id: admin.id, category: 'sms',
                       created_at: Time.now.utc - 3.minutes)
    end

    # according to Olivier, when the client send a message to an admin,
    # the user_id is the same as the sender_id
    # current user replies to admin
    let!(:cuser_adm_msg) do
      create(:message, sender_id: current_user.id, user_id: current_user.id, category: 'sms',
                       created_at: Time.now.utc - 2.minutes)
    end

    # another user replies to admin
    let!(:auser_adm_msg) do
      create(:message, sender_id: another_user.id, user_id: another_user.id, category: 'sms',
                       created_at: Time.now.utc - 1.minute)
    end

    # message generated by campaign
    let!(:campaign_msg) do
      create(:message, sender_id: admin.id, user_id: another_user.id, campaign_id: campaign.id,
                       created_at: Time.now.utc - 5.minutes, category: 'sms')
    end

    let(:adm_msgs) do
      %(query {
        messages(limit: 10, offset: 0) {
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

    let(:campaign_msgs) do
      %(query {
        messages(limit: 10, offset: 0, filter: "/campaign") {
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

    let(:non_campaign_msgs) do
      %(query {
        messages(limit: 10, offset: 0, filter: "/non_campaign") {
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
          readAt
          category
          user {
            id
          }
          sender {
            id
          }
        }
      })
    end

    let(:sms_msgs) do
      %(query {
        messages(limit: 10, offset: 0, filter: "sms/") {
          id
          message
        }
      })
    end
    let(:email_msgs) do
      %(query {
        messages(limit: 10, offset: 0, filter: "email/") {
          id
          message
        }
      })
    end
    let(:sms_campaign_msgs) do
      %(query {
        messages(limit: 10, offset: 0, filter: "sms/campaign") {
          id
          message
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
      expect(result.dig('data', 'userMessages', 0, 'id')).to eql cuser_adm_msg.id
      expect(result.dig('data', 'userMessages', 0, 'sender', 'id')).to eql current_user.id
      expect(result.dig('data', 'userMessages', 0, 'user', 'id')).to eql current_user.id

      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: another_user }).as_json
      expect(result.dig('data', 'userMessages').length).to eql 2
      expect(result.dig('data', 'userMessages', 0, 'id')).to eql auser_adm_msg.id
      expect(result.dig('data', 'userMessages', 0, 'sender', 'id')).to eql another_user.id
      expect(result.dig('data', 'userMessages', 0, 'user', 'id')).to eql another_user.id
    end

    it 'should update messages with is_read status when non-admin user retrieves them' do
      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: another_user }).as_json
      expect(result.dig('data', 'userMessages', 0, 'isRead')).to eql true
      expect(result.dig('data', 'userMessages', 0, 'readAt')).to be_truthy
    end
    it 'is_read status is not updated when admin queries messages' do
      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'userMessages', 0, 'isRead')).to be_nil
      expect(result.dig('data', 'userMessages', 0, 'readAt')).to be_nil
    end
    it 'returns default value of category in message' do
      result = DoubleGdpSchema.execute(auser_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'userMessages', 0, 'category')).to eql 'sms'
    end

    it 'when admin retrieves msgs with non campaign filter, it should have 2 entries' do
      result = DoubleGdpSchema.execute(non_campaign_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 2
      expect(result.dig('data', 'messages', 0, 'id')).to eql auser_adm_msg.id
      expect(result.dig('data', 'messages', 1, 'id')).to eql cuser_adm_msg.id
      expect(result.dig('data', 'messages', 0, 'user', 'id')).to eql another_user.id
      expect(result.dig('data', 'messages', 1, 'user', 'id')).to eql current_user.id
      expect(result.dig('data', 'messages', 0, 'sender', 'id')).to eql another_user.id
      expect(result.dig('data', 'messages', 1, 'sender', 'id')).to eql current_user.id
    end

    it 'when admin retrieves msgs with campaign filter, it should have 1 entries' do
      result = DoubleGdpSchema.execute(campaign_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 1
      expect(result.dig('data', 'messages', 0, 'id')).to eql campaign_msg.id
      expect(result.dig('data', 'messages', 0, 'user', 'id')).to eql another_user.id
    end

    it 'when admin retrieves sms msgs it should have 2 entries' do
      result = DoubleGdpSchema.execute(sms_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 2
      expect(result.dig('data', 'messages', 0, 'message')).to include 'Hello test'
    end

    it 'when admin retrieves email msgs it should have 2 entries' do
      result = DoubleGdpSchema.execute(email_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 0
      expect(result.dig('data', 'messages', 0, 'message')).to be_nil
    end
    it 'when admin retrieves sms and campaigns msgs, it should have 2 entries' do
      result = DoubleGdpSchema.execute(sms_campaign_msgs, context: { current_user: admin }).as_json
      expect(result.dig('data', 'messages').length).to eql 1
      expect(result.dig('data', 'messages', 0, 'message')).to include 'Hello test'
    end
  end
end
