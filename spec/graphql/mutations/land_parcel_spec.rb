# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LandParcel do
  describe 'creating a parcel number' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:user_parcel) do
      create(:land_parcel, community_id: current_user.community_id)
    end
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

    let(:updateQuery) do
      <<~GQL
        mutation EditPlotNumber($id: ID!, $parcelNumber: String!) {
          landParcelUpdate(id: $id, parcelNumber: $parcelNumber) {
            landParcelUpdate
          }
        }
      GQL
    end

    it 'returns a created landParcel' do
      variables = {
        parcelNumber: '12345',
        userId: current_user.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json

      expect(result.dig('data', 'landParcel', 'landParcel', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'returns a updated landParcel' do
      variables = {
        parcelNumber: '12345',
        id: user_parcel.id,
      }

      result = DoubleGdpSchema.execute(updateQuery, variables: variables,
                                                    context: {
                                                      current_user: current_user,
                                                      site_community: current_user.community,
                                                    }).as_json

      expect(result.dig('data', 'landParcelUpdate', 'landParcelUpdate')).not_to be_nil
      expect(result.dig('data', 'landParcelUpdate', 'landParcelUpdate')).to eql true
      expect(result.dig('errors')).to be_nil
    end
  end
end
