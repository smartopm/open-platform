# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::Add do
  describe 'member' do
    let!(:member) { create(:member_with_community) }
    let!(:reporting_member) { create(:member_with_community, community_id: member.community_id) }
    let!(:current_user) { reporting_member.user }

    let!(:other_community_member) { create(:member_with_community) }

    let(:query) do
      <<~GQL
        mutation AddActivityLogMutation($memberId: ID!, $note: String) {
          activityLogAdd(memberId: $memberId, note: $note) {
            id
          }
        }
      GQL
    end

    it 'returns should create an activity log' do
      variables = {
        memberId: member.id,
        actingMemberId: reporting_member.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                current_member: reporting_member,
                                              }).as_json
      expect(result.dig('data', 'activityLogAdd', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'returns should not create an invalid activity log' do
      variables = {
        memberId: member.id,
        actingMemberId: other_community_member.id,
      }
      result = DoubleGdpSchema.execute(
        query, variables: variables, context: {
          current_user: other_community_member.user, current_member: other_community_member
        }
      ).as_json
      expect(result.dig('data', 'activityLogAdd')).to be_nil
      expect(result.dig('errors')).not_to be_empty
    end
  end
end
