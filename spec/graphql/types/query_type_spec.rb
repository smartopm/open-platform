# frozen_string_literal: true

require 'rails_helper'

# TODO: Move these tests to their relevant files

RSpec.describe Types::QueryType do
  describe 'security guard list' do
    let!(:user) { create(:security_guard) }
    let!(:security_guard1) do
      create(:security_guard, community_id: user.community_id, role: user.role)
    end
    let!(:security_guard2) do
      create(:security_guard, community_id: user.community_id, role: user.role)
    end
    let!(:community) { create(:community) }
    let!(:role) { create(:role, name: 'security_guard', community: community) }
    let!(:security_guard_another_commuinity) do
      create(:security_guard, community: community, role: role)
    end
    let!(:current_user) { user }

    let(:query) do
      %(query {
          securityGuards {
            id
            name
            userType
          }
        })
    end

    it 'returns all security guards logs' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'securityGuards').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'feedback' do
    let!(:user) { create(:security_guard) }
    let!(:current_user) { create(:admin_user, community: user.community) }

    let(:query) do
      %(query {
              usersFeedback {
                review
                isThumbsUp
                user {
                  name
                }
              }
          })
    end

    it 'returns all user feedback' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should fails if not logged in' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: nil,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).to be_nil
    end
  end
  # TODO: add more tests cases
end
