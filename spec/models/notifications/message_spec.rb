# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Notifications::Message, type: :model do
  describe 'Associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:sender).class_name('Users::User') }
    it { is_expected.to belong_to(:note).class_name('Notes::Note').optional }
    it { is_expected.to belong_to(:campaign).optional }
    it { is_expected.to have_one(:notification).optional }
  end

  describe 'Message creation' do
    let!(:community) { create(:community) }
    let!(:non_admin) { create(:user, community_id: community.id) }
    let!(:admin) { create(:admin_user, community_id: community.id) }

    # create Message
    it 'should create a message record' do
      Notifications::Message.create(
        receiver: '260971500748',
        message: 'Testing out message',
        user_id: non_admin.id,
        sender_id: admin.id,
        category: 'sms',
      )
      result = Notifications::Message.first
      expect(Notifications::Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
    end

    it 'should create a message record with a default community records', skip_before: true do
      community.default_users = [non_admin.id]
      community.save
      message = Notifications::Message.create(
        receiver: '260971500748',
        message: 'Testing out message',
        user_id: non_admin.id,
        sender_id: non_admin.id,
        category: 'sms',
      )
      create_task = message.create_message_task

      expect(create_task[:user_id]).to eql non_admin.id
      allow(message).to receive(:create_message_task)
    end

    it 'admin sends a message' do
      message = admin.construct_message(
        receiver: '260971500748',
        message: 'Admin testing out message',
        user_id: non_admin.id,
        category: 'sms',
      )
      message.save!
      result = Notifications::Message.first
      expect(Notifications::Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
      expect(result[:user_id]).to eql non_admin.id
      expect(result[:sender_id]).to eql admin.id
      result
    end

    it 'non admin sends a message to admin' do
      message = non_admin.construct_message(
        receiver: '260971500748',
        message: 'Admin testing out message',
        user_id: admin.id,
        category: 'sms',
      )
      message.save!
      result = Notifications::Message.first
      expect(Notifications::Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
      expect(result[:user_id]).to eql admin.id
      expect(result[:sender_id]).to eql non_admin.id
      result
    end

    it 'shouldnt create when category is not valid' do
      message = non_admin.construct_message(
        receiver: '260971500748',
        message: 'Admin testing out message',
        user_id: admin.id,
        category: 'anything',
      )
      expect { message.save! }.to raise_error(ActiveRecord::RecordInvalid)
      expect(Notifications::Message.all.count).to eql 0
    end
  end

  describe 'callbacks' do
    it { is_expected.to callback(:update_campaign_message_count).after(:create) }
    it { is_expected.to callback(:update_campaign_message_count).after(:update) }
  end
end
