# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::EventLog, type: :model do
  let!(:community) { create(:community) }
  let!(:user) { create(:user, community_id: community.id) }
  let!(:security_guard) { create(:security_guard, community_id: community.id) }

  describe 'Associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:acting_user).class_name('Users::User').optional }
  end

  it 'should log user login' do
  end

  describe 'user activity logging' do
    it 'should ignore if already logged activity in the past 24 hours' do
      Logs::EventLog.create(
        subject: 'user_login',
        acting_user: user,
        community: user.community,
        created_at: 16.hours.ago,
      )
      Logs::EventLog.log_user_activity_daily(user)
      expect(Logs::EventLog.where(
        acting_user: user,
        subject: 'user_active',
      ).count).to eql 0
    end

    it 'should only log once every 24 hours' do
      Logs::EventLog.log_user_activity_daily(user)
      Logs::EventLog.log_user_activity_daily(user)
      expect(Logs::EventLog.where(
        acting_user: user,
        subject: 'user_active',
      ).count).to eql 1
    end
  end

  describe '.post_read_by_acting_user' do
    it 'returns post-read logs by a user' do
      log1 = create(:event_log, acting_user: user, community: community, subject: 'post_read')
      log2 = create(:event_log, acting_user: user, community: community, subject: 'user_login')
      log3 = create(:event_log, acting_user: user, community: community, subject: 'post_read')

      results = Logs::EventLog.post_read_by_acting_user(user)

      expect(results).to include(log1, log3)
      expect(results).not_to include(log2)
    end
  end

  describe '.post_read_to_sentence' do
    it 'returns a description for post_read event' do
      log = create(:event_log, acting_user: user, community: community,
                               subject: 'post_read', data: { post_id: 11 })

      expect(log.post_read_to_sentence).to eq("Post 11 was read by #{user.name}")
    end
  end

  describe '.post_shared_to_sentence' do
    it 'returns a description for post_shared event' do
      log = create(:event_log, acting_user: user, community: community,
                               subject: 'post_shared', data: { post_id: 11 })

      expect(log.post_shared_to_sentence).to eq("Post 11 was shared by #{user.name}")
    end
  end
end
