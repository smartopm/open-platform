# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Label do
  describe 'label queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_fetch_all_labels
                                          can_fetch_label_users can_view_lead_labels])
    end

    let!(:current_user) { create(:user_with_community, role: visitor_role) }
    let!(:community) { current_user.community }
    let!(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }

    let!(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let!(:user2) { create(:user, community_id: community.id, role: visitor_role) }

    # create a label for the user
    let!(:first_label) do
      create(:label, community_id: community.id)
    end
    let!(:second_label) do
      create(:label, community_id: community.id)
    end

    let!(:user_label) do
      current_user.user_labels.create!(label_id: first_label.id)
    end

    let!(:other_user_label) do
      user2.user_labels.create!(label_id: second_label.id)
    end

    let(:lead) { create(:lead, community: community, lead_status: 'Site Visit', division: 'China') }
    let(:lead_status_label) do
      create(:label, grouping_name: 'Status', short_desc: 'Evaluation', community: community)
    end
    let(:lead_division_label) do
      create(:label, grouping_name: 'Division', short_desc: 'India', community: community)
    end
    let(:lead_user_label) { create(:user_label, user: lead, label: lead_status_label) }
    let(:other_lead_user_label) { create(:user_label, user: lead, label: lead_division_label) }

    let(:labels_query) do
      %(query {
            labels {
                shortDesc
                userCount
            }
        })
    end

    let(:user_label_query) do
      %(query {
            userLabels(userId: "#{current_user.id}") {
                id
                shortDesc
            }
        })
    end
    let(:other_user_label_query) do
      %(query {
            userLabels(userId: "#{user2.id}") {
                id
                shortDesc
            }
        })
    end

    let(:label_users) do
      %(query {
        labelUsers(labels: "#{first_label.id}, #{second_label.id}") {
          id
          labels {
            id
          }
        }
        })
    end

    let(:lead_labels_query) do
      <<~GQL
        query leadLabels($userId: ID!){
          leadLabels(userId: $userId){
            groupingName
            shortDesc
          }
        }
      GQL
    end

    it 'should retrieve list of labels' do
      result = DoubleGdpSchema.execute(labels_query, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('data', 'labels').length).to eql 5
      expect(result.dig('data', 'labels', 2, 'shortDesc')).not_to be_nil
      expect(result.dig('data', 'labels', 1, 'userCount')).not_to be_nil
    end

    it 'should retrieve labels for the other user' do
      result = DoubleGdpSchema.execute(other_user_label_query, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      rec_exp = result.dig('data', 'userLabels').select { |x| x['shortDesc'].include? 'label' }
      expect(rec_exp[0]['shortDesc']).to include 'label'
      expect(rec_exp[0]['id']).to eql second_label.id
    end

    it 'should retrieve labels for the other user' do
      result = DoubleGdpSchema.execute(user_label_query, context: {
                                         current_user: current_user,
                                         site_community: community,
                                       }).as_json
      rec_exp = result.dig('data', 'userLabels').select { |x| x['id'].eql? first_label.id }
      expect(rec_exp[0]['id']).to eql first_label.id
    end

    it 'should retrieve all users who have this label' do
      result = DoubleGdpSchema.execute(label_users, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('data', 'labelUsers').length).to eql 1
      rec_exp = result.dig('data', 'labelUsers').select { |x| x['id'].eql? current_user.id }
      rec_exp2 = rec_exp.dig(0, 'labels').select { |x| x['id'].eql? first_label.id }
      expect(rec_exp[0]['id']).to eql current_user.id
      expect(rec_exp2[0]['id']).to eql first_label.id
    end

    describe '#lead_labels' do
      context 'when user is authorized' do
        before do
          lead_user_label
          other_lead_user_label
        end

        it 'retrieves lead labels based on current division and status' do
          variables = { userId: lead.id }
          result = DoubleGdpSchema.execute(lead_labels_query, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: community,
                                                              }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'leadLabels').length).to eql 2
        end
      end

      context 'when user does not have the permission' do
        it 'raises unauthorized error' do
          variables = { userId: lead.id }
          result = DoubleGdpSchema.execute(lead_labels_query, variables: variables,
                                                              context: {
                                                                current_user: current_user,
                                                                site_community: community,
                                                              }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
