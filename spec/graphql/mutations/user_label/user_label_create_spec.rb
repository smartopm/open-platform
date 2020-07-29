# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Label::UserLabelCreate do
  describe 'create pending member' do
    let!(:admin_user) { create(:admin_user) }
    let!(:first_user) { create(:user, community_id: admin_user.community_id) }
    let!(:second_user) { create(:user, community_id: admin_user.community_id) }

    let!(:first_label) { create(:label, community_id: admin_user.community_id) }
    let!(:second_label) { create(:label, community_id: admin_user.community_id) }

    let(:query) do
      <<~GQL
          mutation userLabelCreate($userId: String!, $labelId: String!) {
          userLabelCreate(userId: $userId, labelId: $labelId){
            label {
              userId
            }
          }
        }
      GQL
    end

    it 'associates all the user ids with all passed labels' do
      variables = {
        userId: "#{first_user.id},#{second_user.id}",
        labelId: "#{first_label.id},#{second_label.id}",
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin_user,
                                                site_community: admin_user.community_id,
                                              }).as_json
      expect(result.dig('data', 'userLabelCreate', 'label').count).to eql 4
    end
  end
end