# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Business do
  describe 'business queries' do
    let!(:current_user) { create(:user_with_community) }
    # create a business for the user
    let!(:user_business) do
      2.times do
        create(:business, user_id: current_user.id, community_id: current_user.community_id)
      end
    end

    let(:business_query) do
      %(query {
            businesses {
                category
                createdAt
                userId
                user {
                    name
                    id
                }
            }
        })
    end
    it 'should retrieve list of businesses' do
      result = DoubleGdpSchema.execute(business_query, context: {
                                         current_user: current_user,
                                       }).as_json
      expect(result.dig('data', 'businesses').length).to eql 2
      expect(result.dig('data', 'businesses', 0, 'user', 'id')).to eql current_user.id
      expect(result.dig('data', 'businesses', 0, 'userId')).to eql current_user.id
    end
  end
end
