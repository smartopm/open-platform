# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Community do
  describe 'Community queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'community',
                          role: admin_role,
                          permissions: %w[can_view_community_details])
    end

    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, role: admin_role) }

    let(:community_query) do
      <<~GQL
        {
        community(id:"#{current_user.community_id}"){
            id
          }
        }
      GQL
    end

    it 'should retrieve a community by id' do
      result = DoubleGdpSchema.execute(community_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'community', 'id')).to eql current_user.community_id
    end

    it 'should retrieve only when user is admin' do
      result = DoubleGdpSchema.execute(community_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'community', 'id')).to be_nil
    end
  end
end
