# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Label do
  describe 'creating a Label' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let(:query) do
      <<~GQL
        mutation {
            labelCreate(shortDesc: "green") {
            label {
                shortDesc
                id
            }
            }
        }
      GQL
    end

    it 'returns a created Label' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: admin,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'labelCreate', 'label', 'id')).not_to be_nil
      expect(result.dig('data', 'labelCreate', 'label', 'shortDesc')).to eql 'green'
      expect(result.dig('errors')).to be_nil
    end
    it 'returns error when user is not admin' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: user,
                                       }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'labelCreate', 'label', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'creating a user label' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let!(:first_label) do
      create(:label, community_id: user.community_id)
    end

    let(:lquery) do
      <<~GQL
        mutation {
            userLabelCreate(userId:"#{user.id}", labelId:"#{first_label.id}"){
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
      expect(result.dig('data', 'userLabelCreate', 'label', 'userId')).to eql user.id
      expect(result.dig('errors')).to be_nil
    end
  end
  # unassign a label from a user
  describe 'unassign a label from a user' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:user2) { create(:user, community_id: user.community_id) }

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
      expect(res.dig('data', 'userLabels').length).to eql 0
      # community labels should remain untouched after unassigning from a user
      expect(labels.dig('data', 'labels').length).to eql 2
      expect(result.dig('data', 'userLabelUpdate', 'label', 'userId')).to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
end
