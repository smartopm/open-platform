# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityLog, type: :model do
  describe 'An ActivityLog' do
    before :each do
      community = FactoryBot.create(:community)
      other_community = FactoryBot.create(:community)

      @user = FactoryBot.create(:user, community_id: community.id)
      @security_guard = FactoryBot.create(:security_guard, community_id: community.id)
      @other_community_guard = FactoryBot.create(:security_guard, community_id: other_community.id)
    end

    it 'should be associated properly with a reporting_user and a community' do
      activity_log = ActivityLog.new(user_id: @user.id)
      expect(activity_log.valid?).to be false
      expect(activity_log.errors[:reporting_user]).to include('must exist')

      activity_log = ActivityLog.new(user: @user, reporting_user: @security_guard)
      expect(activity_log.valid?).to be true
    end

    it 'Only a user in a community may create an activity log in a
        community they are a member of' do
      activity_log = ActivityLog.new(user: @user, reporting_user: @other_community_guard)
      expect(activity_log.valid?).to be false
      expect(activity_log.errors[:reporting_user])
        .to include('Can only report users in your own community')
    end
  end
end
