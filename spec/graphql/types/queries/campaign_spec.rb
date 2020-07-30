# frozen_string_literal: true

# # frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'campaign queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:label) { create(:label, community_id: current_user.community_id) }
    # create a campaign for the user community
    let!(:campaigns) do
      create(:campaign, community_id: current_user.community_id)
    end

    let!(:campaign_label) { create(:campaign_label, label_id: label.id, campaign_id: campaigns.id) }

    let(:campaigns_query) do
      %(query {
            campaigns {
              communityId
              message
              labels {
                shortDesc
              }
            }
        })
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
    end

    it 'should retrieve the requested campaing via id' do
      result = DoubleGdpSchema.execute(campaign_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'campaign', 'communityId')).to eql current_user.community_id
      expect(result.dig('data', 'campaign', 'name')).to include 'Campaign'
      expect(result.dig('data', 'campaign', 'labels', 0).key?('shortDesc')).to be_truthy
      expect(result.dig('data', 'campaign', 'labels', 0, 'shortDesc')).to eql label.short_desc
    end
  end
end
