# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Message, type: :model do
  describe 'Message creation' do
    before :each do
      community = FactoryBot.create(:community)
      @non_admin = FactoryBot.create(:user_with_community, community_id: community.id)
      @admin = FactoryBot.create(:admin_user, community_id: community.id)
    end

    # create Message
    it 'should create a message record' do
      Message.create(
        receiver: '260971500748',
        message: 'Testing out message',
        user_id: @non_admin.id,
        sender_id: @admin.id,
      )
      result = Message.first
      expect(Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
    end

    it 'should create a message record with a default community records' do
      community = FactoryBot.create(:community)
      user = FactoryBot.create(:user, community: community)
      community.default_users = [user.id]
      community.save
      Message.create(
        receiver: '260971500748',
        message: 'Testing out message',
        user_id: @non_admin.id,
        sender_id: @admin.id,
      )
      result = Message.first
      expect(Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
    end

    it 'admin sends a message' do
      message = @admin.construct_message(
        receiver: '260971500748',
        message: 'Admin testing out message',
        user_id: @non_admin.id,
      )
      message.save!
      result = Message.first
      expect(Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
      expect(result[:user_id]).to eql @non_admin.id
      expect(result[:sender_id]).to eql @admin.id
      result
    end

    it 'non admin sends a message to admin' do
      message = @non_admin.construct_message(
        receiver: '260971500748',
        message: 'Admin testing out message',
        user_id: @admin.id,
      )
      message.save!
      result = Message.first
      expect(Message.all.count).to eql 1
      expect(result[:receiver]).to eql '260971500748'
      expect(result[:user_id]).to eql @admin.id
      expect(result[:sender_id]).to eql @non_admin.id
      result
    end
  end
end
