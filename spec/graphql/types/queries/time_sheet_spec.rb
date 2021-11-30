# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::TimeSheet do
  describe 'retrieving custodian retrieves employee list' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:contractor_role) { create(:role, name: 'contractor') }

    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:security_guard_role) { create(:role, name: 'security_guard') }

    perm_list = %w[can_access_all_timesheets can_fetch_user_last_shift
                   can_fetch_user_time_sheet_logs can_fetch_time_sheet_logs]

    let!(:permission) do
      create(:permission, module: 'timesheet',
                          role: admin_role,
                          permissions: perm_list)
    end
    let!(:custodian_permission) do
      create(:permission, module: 'timesheet',
                          role: custodian_role,
                          permissions: perm_list)
    end
    let!(:guard_permission) do
      create(:permission, module: 'timesheet',
                          role: security_guard_role,
                          permissions: %w[can_fetch_user_time_sheet_logs])
    end

    let!(:user1) { create(:contractor, role: contractor_role) }
    let!(:user2) do
      create(:user, user_type: user1.user_type,
                    community_id: user1.community_id, role: contractor_role)
    end
    let!(:admin) { create(:admin_user, community_id: user1.community_id, role: admin_role) }
    let!(:custodian) do
      create(:store_custodian,
             community_id: user1.community_id, role: custodian_role)
    end
    let!(:security_guard) do
      create(:security_guard,
             community_id: user1.community_id, role: security_guard_role)
    end

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

    context 'when current user is not an admin' do
      it 'raises unauthorized error for user_last_shift_query' do
        result = DoubleGdpSchema.execute(user_last_shift, context: {
                                           current_user: user1,
                                           site_community: custodian.community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end

      it 'raises unauthorized error time_sheet_logs_query' do
        result = DoubleGdpSchema.execute(query, context: {
                                           current_user: user1,
                                           site_community: custodian.community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
