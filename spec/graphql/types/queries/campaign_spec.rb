# frozen_string_literal: true

# # frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Campaign do
  describe 'campaign queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_access_campaign can_list_campaigns
                                          can_get_campaign_details])
    end

    let!(:current_user) { create(:user_with_community) }
    let!(:community) { current_user.community }
    let!(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let!(:label) { create(:label, community_id: community.id) }
    # create a campaign for the user community
    let!(:campaigns) do
      create(:campaign, community_id: community.id, name: 'Test campaign')
    end

    let!(:campaign_label) { create(:campaign_label, label_id: label.id, campaign_id: campaigns.id) }
    let!(:sent_message) do
      create(:message, user_id: current_user.id, sender_id: admin.id, campaign_id: campaigns.id,
                       category: 'sms')
    end

    let(:campaigns_query) do
      <<~GQL
        query campaigns ($query: String) {
          campaigns(query: $query) {
            id
            communityId
            name
            message
            labels {
              shortDesc
            }
            campaignMetrics {
              batchTime
              startTime
              endTime
              totalScheduled
              totalSent
              totalClicked
            }
          }
        }
      GQL
    end

    let(:campaign_query) do
      %(query {
            campaign(id: "#{campaigns.id}") {
              communityId
              name
              labels {
                shortDesc
              }
            }
        })
    end

    # rubocop:disable Layout/LineLength
    it 'should retrieve list of campaigns' do
      result = DoubleGdpSchema.execute(campaigns_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'campaigns').length).to eql 1
      expect(result.dig('data', 'campaigns', 0, 'communityId')).to eql current_user.community_id
      expect(result.dig('data', 'campaigns', 0, 'message')).to eql 'Visiting'
      expect(result.dig('data', 'campaigns', 0, 'labels', 0).key?('shortDesc')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'labels', 0, 'shortDesc')).to eql label.short_desc
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('batchTime')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('startTime')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('endTime')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('totalScheduled')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('totalSent')).to be_truthy
      expect(result.dig('data', 'campaigns', 0, 'campaignMetrics').key?('totalClicked')).to be_truthy
    end
    # rubocop:enable Layout/LineLength

    it 'should retrieve the requested campaing via id' do
      result = DoubleGdpSchema.execute(campaign_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'campaign', 'communityId')).to eql current_user.community_id
      expect(result.dig('data', 'campaign', 'name')).to include 'Test campaign'
      expect(result.dig('data', 'campaign', 'labels', 0).key?('shortDesc')).to be_truthy
      expect(result.dig('data', 'campaign', 'labels', 0, 'shortDesc')).to eql label.short_desc
    end

    context 'when a campaign is searched by name' do
      context 'when the campaign is present' do
        it 'returns the list of matching campaigns' do
          variables = { query: 'camp' }
          result = DoubleGdpSchema.execute(campaigns_query, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: community,
                                                            }).as_json
          expect(result.dig('data', 'campaigns', 0, 'name')).to eql 'Test campaign'
        end
      end

      context 'when campaign is not present' do
        it 'does not return any campaign' do
          variables = { query: 'oldlabel' }
          result = DoubleGdpSchema.execute(campaigns_query, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: community,
                                                            }).as_json
          expect(result.dig('data', 'campaigns').length).to eql 0
        end
      end
    end
  end
end
