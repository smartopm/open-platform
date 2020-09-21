# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EventLog, type: :model do
  before :each do
    community = FactoryBot.create(:community)
    @user = FactoryBot.create(:user, community_id: community.id)
    @security_guard = FactoryBot.create(:security_guard, community_id: community.id)
  end

  it 'should log user login' do
  end

  describe 'user activity logging' do
    it 'should ignore if already logged activity in the past 24 hours' do
      EventLog.create(
        subject: 'user_login',
        acting_user: @user,
        community: @user.community,
        created_at: 16.hours.ago,
      )
      EventLog.log_user_activity_daily(@user)
      expect(EventLog.where(
        acting_user: @user,
        subject: 'user_active',
      ).count).to eql 0
    end

    it 'should only log once every 24 hours' do
      EventLog.log_user_activity_daily(@user)
      EventLog.log_user_activity_daily(@user)
      expect(EventLog.where(
        acting_user: @user,
        subject: 'user_active',
      ).count).to eql 1
    end
  end

  describe '.post_read_by_acting_user' do
    it 'returns post-read logs by a user' do
      user = FactoryBot.create(:user_with_community)
      community = user.community

      log1 = create(:event_log, acting_user: user, community: community, subject: 'post_read')
      log2 = create(:event_log, acting_user: user, community: community, subject: 'user_login')
      log3 = create(:event_log, acting_user: user, community: community, subject: 'post_read')

      results = EventLog.post_read_by_acting_user(user.id)

      expect(results).to include(log1, log3)
      expect(results).not_to include(log2)
    end
  end
end
