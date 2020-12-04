# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Community::CommunityUpdate do
  describe 'updating a community' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:update_community) do
      <<~GQL
        mutation communityUpdate($name: String, $supportNumber: JSON, $supportEmail: JSON){
          communityUpdate(name: $name, supportNumber: $supportNumber, supportEmail: $supportEmail){
            community {
                id
                name
            }
          }
        }
      GQL
    end

    it 'updates a community' do
      email = [{ email: 'abs@g.c', category: 'sales' }]
      variables = {
        name: 'Awesome Name',
        supportEmail: email.to_json,
      }
      result = DoubleGdpSchema.execute(update_community, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: user.community,
                                                         }).as_json
      expect(result.dig('data', 'communityUpdate', 'community', 'id')).to_not be_nil
      expect(result.dig('data', 'communityUpdate', 'community', 'name')).to include 'Awesome Name'
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        name: 'Nkwashi Name',
        supportEmail: [{ email: 'abs@g.c', category: 'sales' }].to_json,
      }
      result = DoubleGdpSchema.execute(update_community, variables: variables,
                                                         context: {
                                                           current_user: user,
                                                           site_community: user.community,
                                                         }).as_json
      expect(result.dig('data', 'communityUpdate', 'community', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
