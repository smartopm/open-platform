# frozen_string_literal: true

require 'rails_helper'
require 'email_msg'

RSpec.describe Users::User, type: :model do
  let!(:community) { create(:community) }
  let!(:current_user) { create(:user_with_community, community_id: community.id) }
  let!(:another) { create(:user, community_id: community.id, role: current_user.role) }
  let!(:admin) { create(:admin_user, community_id: community.id) }
  let!(:msg_id) { 'gzJ5spFzQFGzvp_8h_inlQ.filterdrecv-p3mdw1' }

  let!(:users_emails) do
    [
      { 'from_email' => 'support@doublegdp.com',
        'msg_id' => msg_id,
        'subject' => 'Nkwashi discount promotion on outstanding balance!',
        'to_email' => current_user.email,
        'status' => 'delivered', 'opens_count' => 3, 'clicks_count' => 0,
        'last_event_time' => '2020-06-08T05:29:03Z' },
      { 'from_email' => 'support@doublegdp.com',
        'msg_id' => '4IyHlSLiTy2yglIEzlmdIg.filterdrecv-p3las1-74f77df65c-gtbxz-19-5EDE4049-4.0',
        'subject' => 'Welcome to Nkwashi', 'to_email' => another.email, 'status' => 'delivered',
        'opens_count' => 2, 'clicks_count' => 0, 'last_event_time' => '2020-06-08T13:43:49Z' },
    ]
  end

  let!(:non_users_emails) do
    [
      { 'from_email' => 'support@doublegdp.com',
        'msg_id' => msg_id,
        'subject' => 'Nkwashi discount promotion on outstanding balance!',
        'to_email' => 'm@gmail.com',
        'status' => 'delivered', 'opens_count' => 3, 'clicks_count' => 0,
        'last_event_time' => '2020-06-08T05:29:03Z' },
      { 'from_email' => 'support@doublegdp.com',
        'msg_id' => '4IyHlSLiTy2yglIEzlmdIg.filterdrecv-p3las1-74f77df65c-gtbxz-19-5EDE4049-4.0',
        'subject' => 'Welcome to Nkwashi', 'to_email' => 'mg@doublegdp.io', 'status' => 'delivered',
        'opens_count' => 2, 'clicks_count' => 0, 'last_event_time' => '2020-06-08T13:43:49Z' },
    ]
  end

  # Test if find user based on a community found by name
  # test if the message exist
  # Mock API requests

  it 'should find the user' do
    user = EmailMsg.find_user(admin.email, community.name)
    expect(user).not_to be_nil
    expect(user.name).to eql admin.name
    expect(user.email).to eql admin.email
  end

  it 'should check for message existence' do
    message = admin.construct_message(
      receiver: '2609715007490',
      message: 'Admin testing out message',
      user_id: current_user.id,
      source_system_id: msg_id,
      category: 'email',
    )
    message.save!
    mess = EmailMsg.message_exists?(msg_id, current_user.id)
    expect(mess).to eql true
  end

  it 'should update the message when it exists ' do
    message = admin.construct_message(
      receiver: '260971500748723',
      message: 'Admin testing out message',
      user_id: current_user.id,
      source_system_id: msg_id,
      category: 'email',
    )
    message.save!
    mess = EmailMsg.message_update?(users_emails[0])
    expect(mess).to eql true
  end

  it 'should check for message existence false when not exist' do
    message = admin.construct_message(
      receiver: '2609715007490',
      message: 'Admin testing out message',
      user_id: current_user.id,
      source_system_id: SecureRandom.uuid,
      category: 'email',
    )
    message.save!
    mess = EmailMsg.message_exists?(msg_id, current_user.id)
    expect(mess).to eql false
  end

  it 'shouldn\' have messages before syncing' do
    message = Notifications::Message.all.count
    expect(message).to eql 0
  end

  it 'should save emails as messages for users' do
    EmailMsg.save_sendgrid_messages(community.name, users_emails, admin.email)
    messages = Notifications::Message.all.count
    expect(messages).to eql 2
    expect(current_user.messages.count).to eql 1
    expect(another.messages.count).to eql 1
  end

  it 'shouldn\'n save emails as messages for non users' do
    EmailMsg.save_sendgrid_messages(community.name, non_users_emails, admin.email)
    messages = Notifications::Message.all.count
    expect(messages).to eql 0
    expect(current_user.messages.count).to eql 0
    expect(another.messages.count).to eql 0
  end
end
