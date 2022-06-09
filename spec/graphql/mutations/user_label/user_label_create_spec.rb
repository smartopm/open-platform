# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Label::UserLabelCreate do
  describe 'create pending member' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'label',
                          role: admin_role,
                          permissions: %w[can_create_user_label])
    end

    let!(:admin_user) { create(:admin_user, user_type: 'admin', role: admin_role) }
    let!(:community) { admin_user.community }

    let!(:first_user) do
      create(:user, community_id: admin_user.community_id, role: resident_role,
                    user_type: 'resident')
    end
    let(:lead) { create(:lead, community: community) }
    let!(:second_user) do
      create(:user, community_id: admin_user.community_id, role: resident_role,
                    user_type: 'resident')
    end

    let!(:first_label) { create(:label, community_id: admin_user.community_id) }
    let!(:second_label) { create(:label, community_id: admin_user.community_id) }
    let(:on_target_label) do
      create(:label, community: community, short_desc: 'On Target', grouping_name: 'Investment')
    end
    let(:over_target_label) do
      create(:label, community: community, short_desc: 'Over Target', grouping_name: 'Investment')
    end
    let(:user_label) { create(:user_label, label: on_target_label, user: lead) }

    let(:query) do
      <<~GQL
          mutation userLabelCreate(
            $query: String,
            $limit: Int,
            $labelId: String!,
            $userList: String
          ) {
          userLabelCreate(query: $query, limit: $limit, labelId: $labelId, userList: $userList){
            label {
              userId
            }
          }
        }
      GQL
    end

    it 'associates all the user ids with all passed labels' do
      variables = {
        labelId: "#{first_label.id},#{second_label.id}",
        query: '',
        limit: 50,
        userList: '',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin_user,
                                                site_community: community,
                                              }).as_json
      # 2 userlabel records each for admin_user, first_user & second_user
      expect(result.dig('data', 'userLabelCreate', 'label').count).to eql 6
    end

    context 'when a label with same grouping name already exist for lead user' do
      before { user_label }

      it 'raises error' do
        variables = { labelId: over_target_label.id, userList: lead.id }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: admin_user,
                                                  site_community: community,
                                                }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Over Target labels cannot be associated.'
      end
    end

    context 'when label is not present' do
      it 'raises error' do
        variables = { labelId: '123', userList: lead.id }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: admin_user,
                                                  site_community: community,
                                                }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql ' labels cannot be associated.'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = { labelId: over_target_label.id, userList: lead.id }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: first_user,
                                                  site_community: community,
                                                }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
