# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::EntryRequest do
  describe 'event logs query' do
    let!(:guard_role) { create(:role, name: 'security_guard') }
    let!(:current_user) { create(:security_guard, role: guard_role) }
    let!(:user) { create(:user, community: current_user.community) }

    before :each do
      3.times do
        Logs::EventLog.create(
          community: current_user.community,
          ref_id: user.id,
          ref_type: 'Users::User',
          subject: 'user_entry',
          acting_user: current_user,
        )
      end
      3.times do
        # Will automatically created entry logs
        Logs::EntryRequest.create(name: 'Joe Visitor', user: current_user)
      end

      @query =
        %(query AllEventLogs($subject: [String], $refId: ID, $refType: String){
          result: allEventLogs(subject: $subject, refId: $refId, refType:$refType) {
            id
            createdAt
            refId
            refType
            subject
            sentence
            data
            actingUser {
              name
              id
            }
            user {
              id
            }
            imageUrls
          }
        })
    end

    it 'returns all event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, refId: nil, refType: nil
        },
      ).as_json
      # we expect 5 events as 3 are of subject user_entry and 2 are of subject user_create
      expect(result.dig('data', 'result').length).to eql 5
    end

    it 'returns select event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: 'user_entry', refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, refId: nil, refType: 'Users::User'
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 5

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, refId: user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 4
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: nil },
        variables: {
          subject: nil, refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'event logs query for a user' do
    let!(:current_user) { create(:security_guard) }
    let!(:user) { create(:user, community: current_user.community) }
    before :each do
      3.times do
        Logs::EventLog.create(
          community: user.community,
          ref_id: user.id,
          ref_type: 'Users::User',
          subject: 'user_login',
          acting_user: user,
        )
      end

      @query =
        %(query AllEventLogsForUser($subject: [String], $userId: ID!){
          result: allEventLogsForUser(subject: $subject, userId: $userId) {
            id
            createdAt
            refId
            refType
            subject
            sentence
            data
            actingUser {
              name
              id
            }
          }
        })
    end

    it 'returns all event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, userId: user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 4
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: nil },
        variables: {
          subject: nil, userId: user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe '#logbook_event_logs' do
    let!(:guard_role) { create(:role, name: 'security_guard') }
    let!(:user) { create(:security_guard, role: guard_role) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:permission) do
      create(:permission, module: 'event_log',
                          role: admin.role,
                          permissions: %w[can_fetch_logbook_events])
    end
    let!(:entry_request) { create(:entry_request, user: user, community: community) }
    let!(:entry_log) { user.generate_events('user_entry', entry_request) }
    let!(:visitor_log) do
      user.generate_events('visitor_entry', entry_request, { ref_name: 'John Doe' })
    end
    let!(:observation_log) { user.generate_events('observation_log', entry_request) }
    let(:log_query) do
      <<~GQL
        query logbookEventLogs($startDate: String!, $endDate: String!){
          logbookEventLogs(startDate: $startDate, endDate: $endDate){
            id
          }
        }
      GQL
    end

    context 'when current user is authorized' do
      it 'returns the list of event logs' do
        variables = { startDate: '2022-02-02', endDate: (Time.zone.now + 2.years).to_date.to_s }
        result = DoubleGdpSchema.execute(log_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         },
                                                    variables: variables).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'logbookEventLogs').count).to eql 3
      end
    end

    context 'when current user is not authorized' do
      it 'raises unauthorized error' do
        variables = { startDate: '2022-02-02', endDate: (Time.zone.now + 2.years).to_date.to_s }
        result = DoubleGdpSchema.execute(log_query, context: {
                                           current_user: user,
                                           site_community: community,
                                         },
                                                    variables: variables).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
