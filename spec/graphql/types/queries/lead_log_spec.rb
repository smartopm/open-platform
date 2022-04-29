# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::LeadLog do
  describe 'lead log queries' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'lead_log',
                          role: admin_role,
                          permissions: %w[can_fetch_lead_logs])
    end
    let(:lead_user) { create(:lead) }
    let(:community) { lead_user.community }
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