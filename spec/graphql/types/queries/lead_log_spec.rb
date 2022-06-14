# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::LeadLog do
  describe 'lead log queries' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'lead_log',
                          role: admin_role,
                          permissions: %w[can_fetch_lead_logs can_access_lead_scorecard])
    end
    let(:community) do
      create(:community,
             lead_monthly_targets: [{ division: 'India', target: 3 },
                                    { division: 'China', target: 4 }])
    end
    let(:lead_user) do
      create(:lead, lead_status: 'Signed MOU', division: 'India', community_id: community.id)
    end
    let(:another_lead_user) do
      create(:user,
             name: 'Mark',
             community: community,
             user_type: 'lead',
             lead_status: 'Qualified Lead',
             division: 'China')
    end

    let(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }

    let!(:event_lead_log) do
      create_list(:lead_log, 3,
                  user: lead_user,
                  community: community,
                  acting_user_id: admin.id,
                  log_type: 'event',
                  name: 'new event')
    end

    let!(:meeting_lead_log) do
      create_list(:lead_log, 3,
                  user: lead_user,
                  community: community,
                  acting_user_id: admin.id,
                  log_type: 'meeting',
                  name: 'new meeting')
    end

    let!(:signed_deal_lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: 'signed_deal')
    end

    let!(:qualified_lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: 'lead_status',
             name: 'Qualified Lead')
    end

    let!(:signed_mou_lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: 'lead_status',
             name: 'Signed MOU')
    end

    let!(:signed_lease_lead_log) do
      create(:lead_log,
             user: lead_user,
             community: community,
             acting_user_id: admin.id,
             log_type: 'lead_status',
             name: 'Signed Lease')
    end

    let(:events) do
      <<~GQL
        query fetchEvents($userId: ID!, $limit: Int, $offset: Int){
          leadEvents(userId: $userId, limit: $limit, offset: $offset){
            id
            name
            logType
          }
        }
      GQL
    end

    let(:meetings) do
      <<~GQL
        query fetchMeetings($userId: ID!, $limit: Int, $offset: Int){
          leadMeetings(userId: $userId, limit: $limit, offset: $offset){
            id
            name
            logType
          }
        }
      GQL
    end

    let(:signed_deal) do
      <<~GQL
        query fetchSignedDeals($userId: ID!){
          signedDeals(userId: $userId){
            id
            logType
          }
        }
      GQL
    end

    let(:lead_scorecard) do
      <<~GQL
        query {
          leadScorecards
        }
      GQL
    end

    describe '#lead_events' do
      context 'when lead specific events are fetched' do
        it 'returns events' do
          variables = { userId: lead_user.id, limit: 2, offset: 0 }
          result = DoubleGdpSchema.execute(events, variables: variables,
                                                   context: { current_user: admin,
                                                              site_community: community }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'leadEvents').count).to eql 2
        end
      end
    end

    describe '#lead_meetings' do
      context 'when lead specific meetings are fetched' do
        it 'returns meetings' do
          variables = { userId: lead_user.id, limit: 2, offset: 0 }
          result = DoubleGdpSchema.execute(meetings, variables: variables,
                                                     context: { current_user: admin,
                                                                site_community: community }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'leadMeetings').count).to eql 2
        end
      end
    end

    describe '#signed_deals' do
      context 'when signed deal for lead is fetched' do
        it 'returns signed deals' do
          variables = { userId: lead_user.id }
          result = DoubleGdpSchema.execute(signed_deal, variables: variables,
                                                        context: {
                                                          current_user: admin,
                                                          site_community: community,
                                                        }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'signedDeals').count).to eql 1
        end
      end
    end

    describe '#lead_scorecard' do
      context 'when lead statistics are fetched' do
        before do
          lead_user.update(created_at: "#{Time.zone.now.year}-01-01")
          another_lead_user.update(created_at: "#{Time.zone.now.year}-01-01")
          qualified_lead_log.update(updated_at: "#{Time.zone.now.year}-01-01")
          signed_mou_lead_log.update(updated_at: "#{Time.zone.now.year}-01-01")
          signed_lease_lead_log.update(updated_at: "#{Time.zone.now.year}-01-01")
        end

        it 'returns scorecard' do
          result = DoubleGdpSchema.execute(lead_scorecard,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be nil
          scorecard = result.dig('data', 'leadScorecards')
          expect(scorecard.dig('lead_status', 'Qualified Lead')).to eql 1
          expect(scorecard.dig('lead_status', 'Signed MOU')).to eql 1
          expect(scorecard.dig('leads_monthly_stats_by_division', 'India', '1')).to eql 1
          expect(scorecard.dig('leads_monthly_stats_by_division', 'India').size).to eql 12
          expect(scorecard.dig('leads_monthly_stats_by_division', 'China', '1')).to eql 1
          expect(scorecard.dig('leads_monthly_stats_by_status', 'Qualified Lead', '1')).to eql 1
          expect(scorecard.dig('leads_monthly_stats_by_status', 'Qualified Lead').size).to eql 12
          expect(scorecard.dig('leads_monthly_stats_by_status', 'Signed MOU', '1')).to eql 1
          expect(scorecard.dig('leads_monthly_stats_by_status', 'Signed Lease', '1')).to eql 1
          expect(scorecard.dig('ytd_count', 'leads_by_division')).to eql 2
          expect(scorecard.dig('ytd_count', 'qualified_lead')).to eql 1
          expect(scorecard.dig('ytd_count', 'signed_mou')).to eql 1
          expect(scorecard.dig('ytd_count', 'signed_lease')).to eql 1
        end
      end

      context 'when divisions are not set' do
        before { community.update(lead_monthly_targets: nil) }

        it 'returns empty stats for divisions' do
          result = DoubleGdpSchema.execute(lead_scorecard,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'leadScorecards', 'leads_monthly_stats_by_division')).to eq({})
        end
      end
    end

    context 'when user is unauthorized' do
      it 'throws unauthroized error' do
        variables = { userId: lead_user.id }
        result = DoubleGdpSchema.execute(events, variables: variables,
                                                 context: {
                                                   current_user: lead_user,
                                                   site_community: community,
                                                 }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
