# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Campaign do
  describe 'creating a Campaign' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let(:query) do
      <<~GQL
        mutation campaignCreate(
          $name: String!
          $message: String!
          $batchTime: String!
          $userIdList: String!
        ) {
          campaignCreate(
            name: $name
            message: $message
            batchTime: $batchTime
            userIdList: $userIdList
            ){
              campaign{
                name
                id
              }
            }
          }
      GQL
    end

    it 'returns a created Campaign' do
      variables = {
        name: 'This is a Campaign',
        message: 'Visiting',
        batchTime: '17/06/2020 03:49',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'campaignCreate', 'campaign', 'name')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end

  describe 'updating a Campaign' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:campaign) do
      current_user.community.campaigns.create(name: 'Test Campaign',
                                              message: 'Visiting',
                                              batch_time: '17/06/2020 03:49',
                                              user_id_list: '2saf60afsfdad9618af7114sfda7')
    end

    let(:query) do
      <<~GQL
        mutation campaignUpdate(
          $id: ID!
          $name: String!
          $message: String!
          $batchTime: String!
          $userIdList: String!
        ) {
          campaignUpdate(
            id: $id
            name: $name
            message: $message
            batchTime: $batchTime
            userIdList: $userIdList
          ) {
            campaign {
              id
              name
            }
          }
        }
      GQL
    end

    it 'returns an Campaign' do
      variables = {
        id: campaign.id,
        name: 'This is a Campaign',
        message: 'Visiting',
        batchTime: '17/06/2020 03:49',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                              }).as_json
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'id')).not_to be_nil
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'name')).to eql 'This is a Campaign'
      expect(result.dig('errors')).to be_nil
    end
  end
end
