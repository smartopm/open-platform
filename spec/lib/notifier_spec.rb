# frozen_string_literal: true

require 'notifier'

RSpec.describe Notifier do
  let!(:user) { create(:user_with_community) }
  let!(:label) { create(:label, short_desc: 'com_news_sms', community_id: user.community_id) }

  it 'should return a label' do
    expect(Notifier.label('com_news_sms')).not_to be_nil
  end

  it 'should return nil when short_desc is blank' do
    expect(Notifier.label('')).to be_nil
  end

  it 'should return user list group for a label' do
    user.user_labels.create!(label_id: label.id)

    user_group = Notifier.user_list_from_label('com_news_sms')
    expect(user_group.length).not_to eq 0
  end

  it 'should return nil when no label is given' do
    user_group = Notifier.user_list_from_label('')
    expect(user_group).to be_nil
  end

  it 'should return a user' do
    expect(Notifier.user(user[:id])).not_to be_nil
  end

  it 'should return nil when user_id is blank' do
    expect(Notifier.user('')).to be_nil
  end

  it 'should return a community id when label is given' do
    community_id = Notifier.community_id(label[:short_desc], '')
    expect(community_id).not_to be_nil
    expect(community_id).to eq  label.community_id
  end

  it 'should return a community id when user_id is given' do
    community_id = Notifier.community_id('', user[:id])
    expect(community_id).not_to be_nil
    expect(community_id).to eq  user.community_id
  end

  it 'should return nil when label & user_id is blank' do
    expect(Notifier.community_id('', '')).to be_nil
  end

  it 'should not send notification to user when user_id is blank' do
    data = {
      message_body: 'Message body',
      short_desc: 'Notification from Action FLow',
      community_id: user.community_id,
    }

    Notifier.send_in_app_notification('', data)

    expect(Notifications::Message.count).to eq 0
    expect(Notifications::Notification.count).to eq 0
  end

  it 'should not send notification to user when community_id is nil' do
    data = {
      message_body: 'Message body',
      short_desc: 'Notification from Action FLow',
      community_id: nil,
    }

    Notifier.send_in_app_notification(user[:id], data)

    expect(Notifications::Message.count).to eq 0
    expect(Notifications::Notification.count).to eq 0
  end

  it 'should send notification to user' do
    data = {
      message_body: 'Message body',
      short_desc: 'Notification from Action FLow',
      community_id: user.community_id,
    }

    expect do
      Notifier.send_in_app_notification(user[:id], data)
    end.to change { Notifications::Message.count }.by(1)

    expect do
      Notifier.send_in_app_notification(user[:id], data)
    end.to change { Notifications::Notification.count }.by(1)
  end

  it 'should not call #send_in_app_notification when label & user_id are blank' do
    data = {
      label: '',
      user_id: '',
    }

    Notifier.send_from_action('Sample Message from action', data)

    expect(Notifier).not_to receive(:send_in_app_notification)
  end

  it '#send_from_action should call send notification' do
    data = {
      label: 'com_news_sms',
      user_id: user.id,
    }

    user.user_labels.create!(label_id: label.id)
    expect do
      Notifier.send_from_action('Message', data)
    end.to change { Notifications::Message.count }.by(1)

    expect do
      Notifier.send_from_action('Message', data)
    end.to change { Notifications::Notification.count }.by(1)
  end
end
