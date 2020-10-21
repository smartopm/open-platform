# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LandParcel do
  describe 'creating a parcel number' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:non_admin) { create(:user_with_community, user_type: 'resident') }
    # using a few fields to test since there is a lot
    let(:query) do
      <<~GQL
      mutation AddPlotNumber($userId: ID!, $accountId: ID, $parcelNumber: String!) {
        landParcel(userId: $userId, accountId: $accountId, parcelNumber: $parcelNumber) {
          landParcel {
            id
          }
        }
      }
      GQL
    end

    it 'returns a created landParcel' do
      variables = {
        name: 'Named 21',
        email: 'user@nkwashi.com',
        phoneNumber: '3754937492',
        userId: non_admin.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'businessCreate', 'business', 'id')).not_to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'name')).to include 'Named 21'
      expect(result.dig('data', 'businessCreate', 'business', 'userId')).to eql non_admin.id
      expect(result.dig('errors')).to be_nil
    end

    it 'doesnt create a business when user is not admin' do
      variables = {
        name: 'Named 22',
        email: 'user@nkwashi.coma',
        phoneNumber: '3754937492',
        userId: current_user.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: non_admin,
                                                site_community: non_admin.community,
                                              }).as_json
      expect(result.dig('data', 'businessCreate', 'business', 'id')).to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'name')).to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'userId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
    describe 'creating a business' do
      let!(:current_user) { create(:user_with_community, user_type: 'admin') }

      # create a business for the user
      let!(:user_business) do
        create(:business, user_id: current_user.id, community_id: current_user.community_id,
                          status: 'verified')
      end

      let(:query) do
        <<~GQL
          mutation DeleteBusiness(
            $id: ID!
          ) {
            businessDelete(
              id: $id
              ){
                businessDelete
              }
            }
        GQL
      end

      it 'deletes a business' do
        variables = {
          id: user_business.id,
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: current_user.community,
                                                }).as_json

        expect(result.dig('data', 'businessDelete', 'businessDelete')).to eql true
        expect(result.dig('errors')).to be_nil
      end
    end
  end
end
