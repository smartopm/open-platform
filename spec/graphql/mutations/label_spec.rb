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
                                       }).as_json
      expect(result.dig('data', 'userLabelCreate', 'label', 'userId')).to eql user.id
      expect(result.dig('errors')).to be_nil
    end
  end
end
