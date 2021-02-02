# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LandParcel do
  describe 'creating a parcel number' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:user_parcel) do
      create(:land_parcel, community_id: current_user.community_id)
    end
    let!(:normal_user) { create(:user_with_community) }
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

    let(:propertyQuery) do
      <<~GQL
        mutation AddNewProperty($parcelNumber: String!,
          $address1: String,
          $address2: String,
          $city: String,
          $postalCode: String,
          $stateProvince: String,
          $parcelType: String,
          $country: String,
          $valuationFields: JSON
          $ownershipFields: JSON) {
            PropertyCreate(parcelNumber: $parcelNumber,
            address1: $address1,
            address2: $address2,
            city: $city,
            postalCode: $postalCode,
            stateProvince: $stateProvince,
            parcelType: $parcelType,
            country: $country,
            valuationFields: $valuationFields
            ownershipFields: $ownershipFields) {
              landParcel {
                id
                valuations {
                  amount
                }
                accounts {
                  fullName
                  address1
                }
            }
          }
        }
      GQL
    end

    let(:propertyUpdateQuery) do
      <<~GQL
        mutation UpdateProperty($id: ID!,
          $parcelNumber: String!,
          $address1: String,
          $address2: String,
          $city: String,
          $postalCode: String,
          $stateProvince: String,
          $parcelType: String,
          $country: String,
          $valuationFields: JSON
          $ownershipFields: JSON) {
            propertyUpdate(id: $id,
            parcelNumber: $parcelNumber,
            address1: $address1,
            address2: $address2,
            city: $city,
            postalCode: $postalCode,
            stateProvince: $stateProvince,
            parcelType: $parcelType,
            country: $country,
            valuationFields: $valuationFields
            ownershipFields: $ownershipFields) {
              landParcel {
                id
                valuations {
                  amount
                }
                accounts {
                  fullName
                  address1
                }
            }
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
      expect(result['errors']).to be_nil
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
      expect(result['errors']).to be_nil
    end

    it 'returns a created property' do
      variables = {
        parcelNumber: '12345',
        address1: 'this is address1',
        address2: 'this is address2',
        city: 'this is city',
        postalCode: 'this is postal code',
        stateProvince: 'this is state province',
        parcelType: 'this is parcel type',
        country: 'this is a country',
        valuationFields: [{ amount: 200, startDate: 2.days.from_now }],
        ownershipFields: [{ name: 'owner name',
                            address: 'owner address',
                            userId: current_user.id }],
      }
      prev_valuation_count = Valuation.count

      result = DoubleGdpSchema.execute(propertyQuery, variables: variables,
                                                      context: {
                                                        current_user: current_user,
                                                        site_community: current_user.community,
                                                      }).as_json

      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'id')).not_to be_nil
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'valuations', 0, 'amount')).to eq(
        200,
      )
      expect(Valuation.count).to eq(prev_valuation_count + 1)
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'fullName')).to eq(
        'owner name',
      )
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'address1')).to eq(
        'owner address',
      )
      expect(result['errors']).to be_nil
    end

    it 'raises an error if valuation\'s start-date is in the past' do
      variables = {
        parcelNumber: '67890',
        valuationFields: [{ amount: 200, startDate: 2.days.ago }],
      }

      result = DoubleGdpSchema.execute(propertyQuery, variables: variables,
                                                      context: {
                                                        current_user: current_user,
                                                        site_community: current_user.community,
                                                      }).as_json

      expect(result.dig('errors', 0, 'message')).to eq(
        'Validation failed: Start date can\'t be in the past',
      )
    end

    it 'updates a property' do
      variables = {
        id: user_parcel.id,
        parcelNumber: '#new123',
        address1: 'this is address1',
        address2: 'this is address2',
        city: 'this is city',
        postalCode: 'this is postal code',
        stateProvince: 'this is state province',
        parcelType: 'this is parcel type',
        country: 'this is a country',
        valuationFields: [{ amount: 200, startDate: 2.days.from_now }],
        ownershipFields: [{ name: 'new name',
                            address: 'new address',
                            userId: current_user.id }],
      }

      result = DoubleGdpSchema.execute(
        propertyUpdateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      parcel = LandParcel.find(user_parcel.id)
      expect(parcel.parcel_number).to eq('#new123')
      expect(parcel.valuations.first.amount).to eq(200)
      expect(parcel.accounts.first.full_name).to eq('new name')
      expect(result['errors']).to be_nil
    end

    it 'raises an error if non-admin tries to update a property' do
      variables = {
        id: user_parcel.id,
        parcelNumber: '#new123',
        address1: 'this is address1',
        address2: 'this is address2',
        city: 'this is city',
        postalCode: 'this is postal code',
        stateProvince: 'this is state province',
        parcelType: 'this is parcel type',
        country: 'this is a country',
        valuationFields: [{ amount: 200, startDate: 2.days.from_now }],
        ownershipFields: [{ name: 'new name',
                            address: 'new address',
                            userId: current_user.id }],
      }

      result = DoubleGdpSchema.execute(propertyUpdateQuery, variables: variables,
                                                            context: {
                                                              current_user: normal_user,
                                                              site_community: normal_user.community,
                                                            }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
