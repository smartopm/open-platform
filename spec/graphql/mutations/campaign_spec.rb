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
          $status: String!
          $campaignType: String!
          $batchTime: String!
          $userIdList: String!
          $labels: String!
        ) {
          campaignCreate(
            name: $name
            message: $message
            status: $status
            campaignType: $campaignType
            batchTime: $batchTime
            userIdList: $userIdList
            labels: $labels
            ){
              campaign{
                name
                id
                labels {
                  shortDesc
                }
              }
            }
          }
      GQL
    end

    it 'returns a created Campaign' do
      variables = {
        name: 'This is a Campaign',
        message: 'Visiting',
        campaignType: %w[sms email].sample,
        status: %w[draft scheduled].sample,
        batchTime: '17/06/2020 03:49',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
        labels: 'label 1,label 2',
        subject: 'subject',
        preHeader: 'Pre header',
        templateStyle: 'Template Style',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignCreate', 'campaign', 'name')).not_to be_nil
      expect(result.dig('data', 'campaignCreate', 'campaign', 'labels', 0)).not_to be_nil
      expect(result.dig('data', 'campaignCreate', 'campaign', 'labels', 0, 'shortDesc'))
        .to eql 'label 1'
      expect(result.dig('errors')).to be_nil
    end

    it 'fails to create campaign without campaign type' do
      variables = {
        name: 'This is a Campaign',
        message: 'Visiting',
        batchTime: '17/06/2020 03:49',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
        labels: 'label 1,label 2',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignCreate', 'campaign', 'id')).to be_nil
    end

    it 'fails to create campaign with incomplete field' do
      variables = {
        name: 'This is a Campaign',
        message: 'Visiting',
        status: 'scheduled',
        labels: 'label 1,label 2',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignCreate', 'campaign', 'id')).to be_nil
    end
  end

  describe 'create Campaign through users' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let(:query) do
      <<~GQL
        mutation campaignCreateThroughUsers(
          $filters: String
          $userIdList: String!
        ) {
          campaignCreateThroughUsers(
            filters: $filters
            userIdList: $userIdList
            ){
              campaign{
                id
                name
              }
            }
          }
      GQL
    end

    it 'returns a campaign with filter' do
      variables = {
        filters: 'admin,client,security_guard',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'id')).not_to be_nil
      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'name'))
        .to eql 'admin_client_security_guard'
      expect(result.dig('errors')).to be_nil
    end

    it 'returns a campaign without filter' do
      variables = {
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end

  describe 'updating a Campaign' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:campaign) do
      current_user.community.campaigns.create(name: 'Test Campaign',
                                              message: 'Visiting',
                                              campaign_type: 'sms',
                                              batch_time: '17/06/2020 03:49',
                                              user_id_list: '2saf60afsfdad9618af7114sfda7')
    end

    let(:query) do
      <<~GQL
        mutation campaignUpdate(
          $id: ID!
          $name: String!
          $message: String!
          $labels: String!
        ) {
          campaignUpdate(
            id: $id
            name: $name
            message: $message
            labels: $labels
          ) {
            campaign {
              id
              name
              message
              labels {
                shortDesc
                id
              }
            }
          }
        }
      GQL
    end

    let(:label_remove_query) do
      <<~GQL
        mutation labelRemove($campaignId: ID!, $labelId: ID!) {
          campaignLabelRemove(campaignId: $campaignId, labelId: $labelId){
            campaign {
              id
            }
          }
        }
      GQL
    end

    it 'returns an Campaign' do
      variables = {
        id: campaign.id,
        name: 'This is a Campaign Update',
        message: 'Visiting Update',
        labels: 'label 3',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'id')).not_to be_nil
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'name'))
        .to eql 'This is a Campaign Update'
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'message')).to eql 'Visiting Update'
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'labels', 0, 'shortDesc'))
        .to eql 'label 3'
      expect(result.dig('errors')).to be_nil

      other_variables = {
        campaignId: campaign.id,
        labelId: result.dig('data', 'campaignUpdate', 'campaign', 'labels', 0, 'id'),
      }

      other_result = DoubleGdpSchema.execute(label_remove_query, variables: other_variables,
                                                                 context: {
                                                                   current_user: current_user,
                                                                   site_community:
                                                                   current_user.community,
                                                                 }).as_json
      expect(other_result.dig('data', 'campaignLabelRemove', 'campaign', 'id')).not_to be_nil
      expect(other_result.dig('errors')).to be_nil
    end
  end

  describe 'deleting a Campaign' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:campaign_for_delete) do
      current_user.community.campaigns.create(name: 'Campaign For Delete',
                                              message: 'Mark Deleted',
                                              campaign_type: 'email',
                                              batch_time: '17/06/2020 03:49',
                                              user_id_list: '2saf60afsfdad9618af7114sfda7')
    end

    let(:delete_query) do
      <<~GQL
        mutation campaignDelete(
          $id: ID!
        ) {
          campaignDelete(
            id: $id
          ) {
            campaign {
              id
              status
            }
          }
        }
      GQL
    end

    it 'returns an Campaign' do
      variables = { id: campaign_for_delete.id }
      result = DoubleGdpSchema.execute(delete_query, variables: variables,
                                                     context: {
                                                       current_user: current_user,
                                                       site_community: current_user.community,
                                                     }).as_json
      expect(result.dig('data', 'campaignDelete', 'campaign', 'id')).to eql campaign_for_delete.id
      expect(result.dig('data', 'campaignDelete', 'campaign', 'status')).to eql 'deleted'
      expect(result.dig('errors')).to be_nil
    end
  end
end
