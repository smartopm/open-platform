# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Business do
  describe 'business queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:user2) { create(:user, community: current_user.community, role: current_user.role) }

    # create a business for the user
    let!(:user_business) do
      create(:business, user_id: current_user.id, community_id: current_user.community_id,
                        status: 'verified')
    end
    let!(:other_business) do
      create(:business, user_id: user2.id, community_id: user2.community_id, status: 'verified')
    end

    let(:businesses_query) do
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
    let(:business_query) do
      %(query {
            business(id: "#{user_business.id}") {
                name
                userId
            }
        })
    end

    let(:other_user_business_query) do
      %(query {
            business(id: "#{other_business.id}") {
                name
                userId
            }
        })
    end
    let(:user_business_query) do
      %(query {
            userBusiness(userId: "#{current_user.id}") {
                name
                id
                userId
            }
        })
    end

    it 'should retrieve list of businesses' do
      result = DoubleGdpSchema.execute(businesses_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'businesses').length).to eql 2
      expect(result.dig('data', 'businesses', 0, 'user', 'id')).to eql current_user.id
      expect(result.dig('data', 'businesses', 0, 'userId')).to eql current_user.id
    end

    it 'should retrieve businesses for the current user' do
      result = DoubleGdpSchema.execute(business_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'business', 'name')).to include 'artist'
      expect(result.dig('data', 'business', 'userId')).to eql current_user.id
    end

    it 'should retrieve businesses for the other user' do
      result = DoubleGdpSchema.execute(other_user_business_query, context: {
                                         current_user: current_user,
                                         site_community: user2.community,
                                       }).as_json
      expect(result.dig('data', 'business', 'name')).to include 'artist'
      expect(result.dig('data', 'business', 'userId')).to eql user2.id
    end

    it 'should retrieve businesses for the other user' do
      result = DoubleGdpSchema.execute(user_business_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userBusiness', 0, 'name')).to include 'artist'
      expect(result.dig('data', 'userBusiness', 0, 'userId')).to eql current_user.id
      expect(result.dig('data', 'userBusiness', 0, 'id')).to eql user_business.id
    end
  end
end
