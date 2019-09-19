# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityLog, type: :model do
  describe 'An ActivityLog' do
    before :each do
      community = FactoryBot.create(:community)
      other_community = FactoryBot.create(:community)

      @member = FactoryBot.create(:member, community_id: community.id)
      @security_guard = FactoryBot.create(:member, community_id: community.id)
      @other_community_member = FactoryBot.create(:member, community_id: other_community.id)
    end

    it 'should be associated properly with a reporting_member and a community' do
      activity_log = ActivityLog.new(member_id: @member.id)
      expect(activity_log.valid?).to be false
      expect(activity_log.errors[:reporting_member]).to include('must exist')

      activity_log = ActivityLog.new(member: @member, reporting_member: @security_guard)
      expect(activity_log.valid?).to be true
    end

    it 'Only a member of a community may create an activity log in a
        community they are a member of' do
      activity_log = ActivityLog.new(member: @member, reporting_member: @other_community_member)
      expect(activity_log.valid?).to be false
      expect(activity_log.errors[:reporting_member])
        .to include('Can only report members in your own community')
    end
  end
end
