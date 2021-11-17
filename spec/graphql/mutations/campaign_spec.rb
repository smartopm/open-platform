# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Mutations::Campaign do
  describe 'creating a Campaign' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_create_campaign])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }
    let!(:community) { current_user.community }
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
          $emailTemplatesId: ID
        ) {
          campaignCreate(
            name: $name
            message: $message
            status: $status
            campaignType: $campaignType
            batchTime: $batchTime
            userIdList: $userIdList
            labels: $labels
            emailTemplatesId: $emailTemplatesId
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

    shared_examples 'creates campaign' do |status, campaign_type|
      it 'creates a campaign' do
        variables = {
          name: 'This is a Campaign',
          message: 'Visiting',
          campaignType: campaign_type,
          status: status,
          batchTime: '17/06/2020 03:49',
          userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
          labels: 'label 1,label 2',
          emailTemplatesId: email_template_id,
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: current_user.community,
                                                }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'campaignCreate', 'campaign', 'name')).not_to be_nil
        expect(result.dig('data', 'campaignCreate', 'campaign', 'labels', 0)).not_to be_nil
        expect(result.dig('data', 'campaignCreate', 'campaign', 'labels', 0, 'shortDesc'))
          .not_to be_nil
      end
    end

    context 'when status is scheduled' do
      context 'when campaign type is email' do
        include_examples 'creates campaign', 'scheduled', 'email' do
          let!(:email_template) { create(:email_template, community_id: community.id) }
          let!(:email_template_id) { email_template.id }
        end
      end

      context 'when campaign type is sms' do
        include_examples 'creates campaign', 'scheduled', 'sms' do
          let!(:email_template_id) { nil }
        end
      end
    end

    context 'when status is draft' do
      context 'when campaign type is email' do
        include_examples 'creates campaign', 'draft', 'email' do
          let!(:email_template) { create(:email_template, community_id: community.id) }
          let!(:email_template_id) { email_template.id }
        end
      end

      context 'when campaign type is sms' do
        include_examples 'creates campaign', 'draft', 'sms' do
          let!(:email_template_id) { nil }
        end
      end
    end

    context 'when campaign type is not present' do
      it 'fails to create campaign' do
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
    end

    context 'when all required field are not present' do
      it 'fails to create campaign' do
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
  end

  describe 'create campaign through users' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_create_campaign_through_users can_create_campaign])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }
    let!(:user1) { create(:user_with_community) }
    let!(:user2) { create(:user_with_community) }
    let(:query) do
      <<~GQL
        mutation campaignCreateThroughUsers(
          $query: String,
          $limit: Int,
          $userList: String
        ) {
          campaignCreateThroughUsers(
            query: $query,
            limit: $limit,
            userList: $userList
            ){
              campaign{
                id
                name
                userIdList
              }
            }
          }
      GQL
    end

    it 'create a campaign with filters' do
      variables = {
        query: '', limit: 50, userList: user2.id.to_s
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json

      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'userIdList'))
        .to eq(user2.id.to_s)
      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'name'))
        .to eql 'Default Campaign Name'
      expect(result['errors']).to be_nil
    end

    it 'create a campaign through user_list' do
      variables = {
        query: '', limit: 50, userList: ''
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json

      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'id')).not_to be_nil
      expect(result.dig('data', 'campaignCreateThroughUsers', 'campaign', 'name'))
        .to eql 'Default Campaign Name'
      expect(result['errors']).to be_nil
    end
  end

  describe 'updating a Campaign' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_update_campaign can_remove_campaign_label])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }
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
      expect(result['errors']).to be_nil

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
      expect(other_result['errors']).to be_nil
    end
  end

  describe 'deleting a Campaign' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_delete_campaign can_remove_campaign_label])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }
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
      expect(result['errors']).to be_nil
    end
  end
end
