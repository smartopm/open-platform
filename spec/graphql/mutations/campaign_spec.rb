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

    let!(:current_user) { create(:admin_user, user_type: 'admin', role: admin_role) }
    let!(:community) { current_user.community }
    let(:user) { create(:user, community: community) }
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

    context 'when campaign status is scheduled' do
      it 'enqueues the campaign job' do
        variables = {
          name: 'This is a Campaign',
          message: 'Visiting',
          campaignType: 'sms',
          status: 'scheduled',
          batchTime: '17/06/2022 03:49',
          labels: 'label 1',
          userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: current_user.community,
                                                }).as_json
        expect(result['errors']).to be_nil
        campaign_id = result.dig('data', 'campaignCreate', 'campaign', 'id')
        expect(CampaignSchedulerJob).to have_been_enqueued.with(campaign_id)
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
          campaignType: 'sms',
          batchTime: '',
          userIdList: '23fsafsafa1147',
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: community,
                                                }).as_json
        expect(result.dig('data', 'campaignCreate')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Missing field: Please Supply Batch Time'
      end
    end

    context 'when currrent user is not an admin' do
      it 'raises unauthorized error' do
        variables = {
          name: 'This is a Campaign',
          message: 'Visiting',
          status: 'scheduled',
          labels: 'label 1,label 2',
          campaignType: 'sms',
          batchTime: '17/06/2020 03:49',
          userIdList: '23fsafsafa1147',
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: user,
                                                  site_community: community,
                                                }).as_json
        expect(result.dig('data', 'campaignCreate')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
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
    let!(:user1) { create(:user, community: current_user.community) }
    let!(:user2) { create(:user, community: current_user.community, role: user1.role) }
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
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_update_campaign can_remove_campaign_label])
    end
    let!(:current_user) { create(:admin_user, user_type: 'admin', role: admin_role) }
    let!(:community) { current_user.community }
    let!(:user) do
      create(:site_worker, user_type: 'site_worker', role: site_worker_role, community: community)
    end
    let!(:campaign) do
      community.campaigns.create(name: 'Test Campaign',
                                 message: 'Visiting',
                                 campaign_type: 'sms',
                                 batch_time: '17/06/2020 03:49',
                                 user_id_list: '2saf60afsfdad9618af7114sfda7')
    end
    let!(:label) { create(:label, community: community, short_desc: 'demo_label') }
    let!(:campaign_label) { create(:campaign_label, campaign: campaign, label: label) }

    let(:query) do
      <<~GQL
        mutation campaignUpdate(
          $id: ID!
          $name: String!
          $message: String!
          $labels: String!
          $status: String
          $campaignType: String
          $batchTime: String
          $userIdList: String
        ) {
          campaignUpdate(
            id: $id
            name: $name
            message: $message
            labels: $labels
            status: $status
            campaignType: $campaignType
            batchTime: $batchTime
            userIdList: $userIdList
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
        status: 'scheduled',
        batchTime: '17/06/2022 03:49',
        campaignType: 'sms',
        userIdList: '23fsafsafa1147,2609adf61sfsdfs871fd147',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: community,
                                              }).as_json
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'id')).not_to be_nil
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'name'))
        .to eql 'This is a Campaign Update'
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'message')).to eql 'Visiting Update'
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'labels', 0, 'shortDesc'))
        .to eql 'label 3'
      expect(CampaignSchedulerJob).to have_been_enqueued.with(campaign.id)
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

    it 'it returns an error when a user is unauthorised' do
      variables = {
        id: campaign.id,
        name: 'This is a Campaign Update',
        message: 'Visiting Update',
        labels: 'label 3',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'id')).to be_nil
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'name')).to be_nil
      expect(result.dig('data', 'campaignUpdate', 'campaign', 'userId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    context 'when a campaign is in progress' do
      before { campaign.in_progress! }

      it 'raises updates cannot be made error' do
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
        expect(result.dig('errors', 0, 'message')).to eql 'The updates cannot be made as campaign' \
        ' is in progress. Please create a new campaign.'
      end
    end

    context 'when campaign status is updated to scheduled and all required fields are
            not present' do
      it 'raises missing parameter error' do
        variables = {
          id: campaign.id,
          name: 'This is a Campaign Update',
          message: 'Visiting Update',
          labels: 'label 3',
          status: 'scheduled',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: community,
                                                }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Missing field: Please Supply Campaign '\
                                                          'Type'
      end
    end
  end

  describe 'deleting a Campaign' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'campaign',
                          role: admin_role,
                          permissions: %w[can_delete_campaign can_remove_campaign_label])
    end

    let!(:current_user) { create(:admin_user, user_type: 'admin', role: admin_role) }
    let!(:user) { create(:site_worker, user_type: 'site_worker', role: site_worker_role) }
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

    it 'returns un authorised if user is not to see campaign' do
      variables = { id: campaign_for_delete.id }
      result = DoubleGdpSchema.execute(delete_query, variables: variables,
                                                     context: {
                                                       current_user: user,
                                                       site_community: current_user.community,
                                                     }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
