# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Label do
  describe 'label queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:user2) { create(:user, community_id: current_user.community_id) }

    # create a label for the user
    let!(:first_label) do
      create(:label, community_id: current_user.community_id)
    end
    let!(:second_label) do
      create(:label, community_id: user2.community_id)
    end

    let!(:user_label) do
      current_user.user_labels.create!(label_id: first_label.id)
    end

    let!(:other_user_label) do
      user2.user_labels.create!(label_id: second_label.id)
    end

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

    it 'should retrieve list of labels' do
      result = DoubleGdpSchema.execute(labels_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'labels').length).to eql 4
      expect(result.dig('data', 'labels', 2, 'shortDesc')).to include 'com_news_sms'
      expect(result.dig('data', 'labels', 1, 'userCount')).to eql 3
    end

    it 'should retrieve labels for the other user' do
      result = DoubleGdpSchema.execute(other_user_label_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userLabels', 2, 'shortDesc')).to include 'label'
      expect(result.dig('data', 'userLabels', 2, 'id')).to eql second_label.id
    end

    it 'should retrieve labels for the other user' do
      result = DoubleGdpSchema.execute(user_label_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userLabels', 2, 'id')).to eql first_label.id
    end

    it 'should retrieve all users who have this label' do
      result = DoubleGdpSchema.execute(label_users, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'labelUsers').length).to eql 1
      expect(result.dig('data', 'labelUsers', 0, 'id')).to eql current_user.id
      expect(result.dig('data', 'labelUsers', 0, 'labels', 2, 'id')).to eql first_label.id
    end
  end
end
