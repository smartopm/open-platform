# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Label do
  describe 'creating a Label' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_create_label])
    end

    let!(:admin) { create(:admin_user, user_type: 'admin', role: admin_role) }

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let(:community) { user.community }
    let(:scoped_label) do
      create(:label, short_desc: 'Qualified', grouping_name: 'Lead', community: community)
    end
    let(:mutation) do
      <<~GQL
        mutation labelCreate($shortDesc: String!) {
          labelCreate(shortDesc: $shortDesc) {
            label {
              shortDesc
              groupingName
              id
            }
          }
        }
      GQL
    end

    it 'returns a created Label' do
      variables = { shortDesc: 'green' }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json

      dub_result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                             current_user: admin,
                                             site_community: user.community,
                                           }).as_json
      expect(result.dig('data', 'labelCreate', 'label', 'id')).not_to be_nil
      expect(result.dig('data', 'labelCreate', 'label', 'shortDesc')).to eql 'green'
      expect(result['errors']).to be_nil

      expect(dub_result.dig('data', 'labelCreate', 'label', 'id')).to be_nil
      expect(dub_result.dig('data', 'labelCreate', 'label', 'shortDesc')).to be_nil
      expect(dub_result['errors']).not_to be_nil
      expect(dub_result.dig('errors', 0, 'message')).to include 'Duplicate label'
    end

    context 'when scoped label is provided' do
      it 'creates grouped label' do
        variables = { shortDesc: 'Lead::Qualified' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           current_user: admin,
                                           site_community: user.community,
                                         }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'labelCreate', 'label', 'groupingName')).to eql 'Lead'
        expect(result.dig('data', 'labelCreate', 'label', 'shortDesc')).to eql 'Qualified'
      end
    end

    context 'when label with same grouping name already exists' do
      before { scoped_label }

      it 'raises error' do
        variables = { shortDesc: 'Lead::Qualified' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json
        expect(result['errors']).not_to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Duplicate label'
      end
    end

    context 'when multi seperators are provided' do
      it 'creates grouped label' do
        variables = { shortDesc: 'Leads::Lead::Qualified' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           current_user: admin,
                                           site_community: user.community,
                                         }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'labelCreate', 'label', 'groupingName')).to eql 'Leads::Lead'
        expect(result.dig('data', 'labelCreate', 'label', 'shortDesc')).to eql 'Qualified'
      end
    end

    it 'returns error when user is not admin' do
      variables = { shortDesc: 'green' }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'result', 'labelCreate', 'label', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'creating a user label' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_create_user_label can_create_label])
    end

    let!(:user) { create(:user_with_community) }
    let!(:user2) { create(:user, community: user.community, role: user.role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:admin2) do
      create(:admin_user, community_id: user2.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:first_label) do
      create(:label, community_id: user.community_id)
    end

    let(:lquery) do
      <<~GQL
        mutation {
            userLabelCreate(
              query: "",
              limit: 50,
              labelId:"#{first_label.id}",
              userList: ""
            ){
                label {
                    userId
                }
          }
        }
      GQL
    end

    let(:query_by_user_list) do
      <<~GQL
        mutation {
            userLabelCreate(
              query: "",
              limit: 50,
              labelId:"#{first_label.id}",
              userList: "#{user2.id}"
            ){
                label {
                    userId
                }
          }
        }
      GQL
    end

    it 'returns a created userLabel' do
      result = DoubleGdpSchema.execute(lquery, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      user_ids = result.dig('data', 'userLabelCreate', 'label').map { |data| data['userId'] }
      expect(user_ids).to include(user.id)
      expect(result['errors']).to be_nil
    end

    it 'returns a created userLabel through user list' do
      result = DoubleGdpSchema.execute(query_by_user_list, context: {
                                         current_user: admin2,
                                         site_community: user2.community,
                                       }).as_json

      expect(result.dig('data', 'userLabelCreate', 'label', 0, 'userId')).to eql user2.id
      expect(result['errors']).to be_nil
    end
  end
  # unassign a label from a user
  describe 'unassign a label from a user' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_update_label can_create_label can_update_user_label
                                          can_fetch_all_labels can_fetch_user_labels])
    end
    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:user2) do
      create(:user, community_id: user.community_id, role: resident_role, user_type: 'resident')
    end

    # create a label for the user
    let!(:first_label) do
      create(:label, community_id: user.community_id)
    end
    let!(:second_label) do
      create(:label, community_id: user2.community_id)
    end

    let!(:user_label) do
      user.user_labels.create!(label_id: first_label.id)
    end

    let!(:other_user_label) do
      user2.user_labels.create!(label_id: second_label.id)
    end

    let(:dquery) do
      <<~GQL
        mutation {
          userLabelUpdate(userId:"#{user2.id}", labelId:"#{second_label.id}"){
            label {
              labelId
            }
          }
        }
      GQL
    end

    let(:labels_query) do
      %(query {
            labels {
                shortDesc
            }
        })
    end

    let(:user_label_query) do
      %(query {
            userLabels(userId: "#{user2.id}") {
                id
                shortDesc
            }
        })
    end

    it 'deletes a label from a user' do
      result = DoubleGdpSchema.execute(dquery, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      res = DoubleGdpSchema.execute(user_label_query, context: {
                                      current_user: admin,
                                      site_community: user.community,
                                    }).as_json
      labels = DoubleGdpSchema.execute(labels_query, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      # user labels should be gone after the mutation
      expect(res.dig('data', 'userLabels').length).to eql 3
      # community labels should remain untouched after unassigning from a user
      expect(labels.dig('data', 'labels').length).to eql 5
      expect(result.dig('data', 'userLabelUpdate', 'label', 'userId')).to be_nil
      expect(result['errors']).to be_nil
    end
  end

  describe 'Updating a Label' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_update_label can_create_label])
    end
    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:label) { create(:label, community_id: user.community_id) }

    let(:mutation) do
      <<~GQL
        mutation LabelUpdate($id: ID!, $shortDesc: String!, $color: String!){
          labelUpdate(id: $id, shortDesc: $shortDesc, color: $color) {
          label {
              shortDesc
              groupingName
            }
          }
        }
      GQL
    end

    it 'returns the updated Label' do
      variables = {
        id: label.id,
        shortDesc: 'green',
        color: '#fff',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'labelUpdate', 'label', 'shortDesc')).to eql 'green'
      expect(result['errors']).to be_nil
    end

    context 'when scoped label is provided' do
      it 'updates label' do
        variables = {
          id: label.id,
          shortDesc: 'Campaigns::Sent',
          color: '#fff',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           current_user: admin,
                                           site_community: user.community,
                                         }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'labelUpdate', 'label', 'groupingName')).to eql 'Campaigns'
        expect(result.dig('data', 'labelUpdate', 'label', 'shortDesc')).to eql 'Sent'
      end
    end

    context 'when label is not scoped' do
      before { label.update(grouping_name: 'something') }
      it 'updates grouping name to nil' do
        variables = {
          id: label.id,
          shortDesc: 'campaigns_sent',
          color: '#fff',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           current_user: admin,
                                           site_community: user.community,
                                         }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'labelUpdate', 'label', 'groupingName')).to eql nil
        expect(result.dig('data', 'labelUpdate', 'label', 'shortDesc')).to eql 'campaigns_sent'
      end
    end

    it 'returns error when user is not admin' do
      variables = {
        id: label.id,
        shortDesc: 'com_news_email',
        color: '#fff',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'deleting a Label' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_update_label can_delete_label])
    end
    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:label) { create(:label, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation {
          labelDelete(id: "#{label.id}") {
            labelDelete
          }
        }
      GQL
    end

    it 'returns the deleted Label' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'labelDelete', 'labelDelete')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'returns error when user is not admin' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: user,
                                       }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'merging a two Labels' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_merge_labels can_delete_label])
    end
    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:f_label) { create(:label, community_id: user.community_id) }
    let!(:s_label) { create(:label, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation {
          labelMerge(labelId: "#{f_label.id}", mergeLabelId: "#{s_label.id}") {
            success
         }
        }
      GQL
    end

    it 'returns success if merging is successful' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'labelMerge', 'success')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'returns error when user is not admin' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: user,
                                       }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
