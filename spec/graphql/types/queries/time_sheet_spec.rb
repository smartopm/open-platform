# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::TimeSheet do
  describe 'retrieving custodian retrieves employee list' do
    let!(:user1) { create(:contractor) }
    let!(:user2) { create(:user, user_type: user1.user_type, community_id: user1.community_id) }
    let!(:admin) { create(:admin_user, community_id: user1.community_id) }
    let!(:custodian) { create(:store_custodian, community_id: user1.community_id) }
    let!(:security_guard) { create(:security_guard, community_id: user1.community_id) }

    let!(:time_minus_2days) { Time.current - 2.days }
    let!(:time_minus_1days) { Time.current - 1.day }
    let!(:time_plus_5days) { Time.current + 5.days }
    let!(:time_now) { Time.current }

    let!(:time_log1_user1) do
      create(:time_sheet,
             user: user1,
             started_at: time_minus_2days,
             created_at: time_minus_2days,
             ended_at: time_minus_1days,
             updated_at: time_minus_1days,
             community_id: user1.community_id)
    end

    let!(:time_log2_user1) do
      create(:time_sheet,
             user: user1,
             started_at: time_minus_1days,
             created_at: time_minus_1days,
             ended_at: time_now,
             updated_at: time_now,
             community_id: user1.community_id)
    end

    let!(:time_log1_user2) do
      create(:time_sheet,
             user: user2,
             started_at: time_minus_1days,
             created_at: time_minus_1days,
             ended_at: time_now,
             updated_at: time_now,
             community_id: user1.community_id)
    end

    let(:query) do
      <<~GQL
        query {
          timeSheetLogs {
            endedAt
            startedAt
            id
            user {
              name
            }
            userId
          }
        }
      GQL
    end

    let(:single_user) do
      %(query {
        userTimeSheetLogs(userId: "#{user1.id}",
          dateTo: "#{time_plus_5days}",
          dateFrom: "#{time_minus_2days}") {
          startedAt
          endedAt
          id
        }
      })
    end

    let(:single_non_user) do
      %(query {
        userTimeSheetLogs(userId: "9284jhds",
          dateTo: "#{time_plus_5days}",
          dateFrom: "#{time_minus_2days}") {
          startedAt
          endedAt
          id
        }
      })
    end

    let(:user_last_shift) do
      %(query {
        userLastShift(userId:"#{user1.id}"){
          id
        }
      })
    end

    it 'list contains all employees' do
      expect(Users::TimeSheet.all.length).to eql 3
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: custodian,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'timeSheetLogs').length).to eql 2
      expect(result.dig('data', 'timeSheetLogs', 0, 'userId')).to eql time_log2_user1.user_id
      expect(result.dig('data', 'timeSheetLogs', 0, 'id')).to eql time_log2_user1.id
    end

    it 'list contains one row per employee' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: custodian,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'timeSheetLogs', 0, 'userId')).to eql time_log2_user1.user_id
      expect(result.dig('data', 'timeSheetLogs', 1, 'userId')).to eql time_log1_user2.user_id
    end

    it 'can retrieve timesheet per employee' do
      result = DoubleGdpSchema.execute(single_user, context: {
                                         current_user: custodian,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'userTimeSheetLogs').length).to eql 2
      expect(result.dig('data', 'userTimeSheetLogs', 0, 'id')).to eql time_log2_user1.id
      expect(result.dig('data', 'userTimeSheetLogs', 1, 'id')).to eql time_log1_user1.id
    end

    it 'doesnt get timesheet logs for other user when not admin/custodian' do
      result = DoubleGdpSchema.execute(single_user, context: {
                                         current_user: user2,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'userTimeSheetLogs')).to be_nil
    end

    it 'gets timesheet logs for current user' do
      result = DoubleGdpSchema.execute(single_user, context: {
                                         current_user: user1,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'userTimeSheetLogs')).not_to be_nil
      expect(result.dig('data', 'userTimeSheetLogs').length).to eql 2
      expect(result.dig('data', 'userTimeSheetLogs', 0, 'id')).to eql time_log2_user1.id
    end

    it 'can retrieve timesheet per employee' do
      result = DoubleGdpSchema.execute(single_non_user, context: {
                                         current_user: custodian,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('data', 'userTimeSheetLogs').length).to eql 0
    end

    it 'can retrieve last timesheet log for an employee' do
      result = DoubleGdpSchema.execute(user_last_shift, context: {
                                         current_user: custodian,
                                         site_community: custodian.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'userLastShift')).not_to be_nil
    end
  end
end
