# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LandParcel do
  describe 'creating a parcel number' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:user_parcel) do
      create(:land_parcel, community_id: current_user.community_id)
    end
    let!(:normal_user) { create(:user_with_community) }

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
            ownershipFields: $ownershipFields,) {
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
      prev_valuation_count = Properties::Valuation.count

      result = DoubleGdpSchema.execute(propertyQuery, variables: variables,
                                                      context: {
                                                        current_user: current_user,
                                                        site_community: current_user.community,
                                                      }).as_json

      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'id')).not_to be_nil
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'valuations', 0, 'amount')).to eq(
        200,
      )
      expect(Properties::Valuation.count).to eq(prev_valuation_count + 1)
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'fullName')).to eq(
        'owner name',
      )
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'address1')).to eq(
        'owner address',
      )
      expect(result['errors']).to be_nil
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

      parcel = Properties::LandParcel.find(user_parcel.id)
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

  describe 'merging land parcels' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:user_parcel) do
      create(:land_parcel, community_id: current_user.community_id)
    end
    let!(:normal_user) { create(:user_with_community) }

    let(:propertyMergeQuery) do
      <<~GQL
        mutation MergeProperty($id: ID!,
          $parcelNumber: String!, $geom: String!) {
            propertyMerge(id: $id,
            parcelNumber: $parcelNumber, geom: $geom) {
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

    it 'merges a property and updates parcel number and geom' do
      variables = {
        id: user_parcel.id,
        parcelNumber: 'BAD-PLOT',
        geom: '{"type": "feature"}',
      }

      result = DoubleGdpSchema.execute(
        propertyMergeQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      parcel = Properties::LandParcel.find(user_parcel.id)
      expect(parcel.parcel_number).to eq('BAD-PLOT')
      expect(parcel.geom).to eq(variables[:geom])
      expect(result['errors']).to be_nil
    end

    it 'raises an error if non-admin tries to merge a property' do
      variables = {
        id: user_parcel.id,
        parcelNumber: 'BAD-PLOT',
        geom: '{"type": "feature"}',
      }

      result = DoubleGdpSchema.execute(propertyMergeQuery, variables: variables,
                                                           context: {
                                                             current_user: normal_user,
                                                             site_community: normal_user.community,
                                                           }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'adding and removing points of interest' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:normal_user) { create(:user_with_community) }

    let(:pointOfInterestCreateQuery) do
      <<~GQL
        mutation PointOfInterestCreate($longX: Float!,
          $latY: Float!,
          $geom: String!) {
            pointOfInterestCreate(longX: $longX,
            latY: $latY,
            geom: $geom) {
              landParcel {
                id
                parcelType
                parcelNumber
            }
          }
        }
      GQL
    end

    let(:pointOfInterestDeleteQuery) do
      <<~GQL
        mutation PointOfInterestDelete($id: ID!) {
            pointOfInterestDelete(id: $id) {
              success
          }
        }
      GQL
    end

    it 'creates a new point of interest' do
      variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestCreateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      parcel = Properties::LandParcel.find_by(long_x: variables[:longX], lat_y: variables[:latY])
      expect(parcel.parcel_number).to match(/poi-\w+/i)
      expect(parcel.parcel_type).to eq('poi')
      expect(parcel.geom).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'raises an error if non-admin tries to create a point of interest' do
      variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestCreateQuery,
        variables: variables,
        context: {
          current_user: normal_user,
          site_community: normal_user.community,
        },
      ).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'deletes a point of interest' do
      variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestCreateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(Properties::LandParcel.count).to eq(1)

      parcel = Properties::LandParcel.find_by(long_x: variables[:longX], lat_y: variables[:latY])
      expect(parcel.parcel_number).to match(/poi-\w+/i)
      expect(parcel.parcel_type).to eq('poi')
      expect(parcel.geom).not_to be_nil
      expect(result['errors']).to be_nil

      delete_result = DoubleGdpSchema.execute(
        pointOfInterestDeleteQuery,
        variables: { id: parcel.id },
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(delete_result['errors']).to be_nil
      expect(delete_result.dig('data', 'pointOfInterestDelete', 'success')).to be(true)
      expect(Properties::LandParcel.count).to eq(0)
    end

    it 'raises an error if non-admin tries to delete a point of interest' do
      variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
      }

      DoubleGdpSchema.execute(
        pointOfInterestCreateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(Properties::LandParcel.count).to eq(1)

      parcel = Properties::LandParcel.find_by(long_x: variables[:longX], lat_y: variables[:latY])
      delete_result = DoubleGdpSchema.execute(
        pointOfInterestDeleteQuery,
        variables: { id: parcel.id },
        context: {
          current_user: normal_user,
          site_community: normal_user.community,
        },
      ).as_json

      expect(delete_result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end

  describe 'poi image upload' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:user_parcel) do
      create(:land_parcel, community_id: current_user.community_id, parcel_type: 'poi')
    end
    let!(:normal_user) { create(:user_with_community) }

    let(:poiImageUpload) do
      <<~GQL
        mutation poiImageUpload($id: ID!,
          $imageBlobId: String!) {
            poiImageUpload(id: $id, imageBlobId: $imageBlobId) {
              landParcel {
                id
                parcelNumber
            }
          }
        }
      GQL
    end

    it 'attach image and return the land parcel' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        id: user_parcel.id,
        imageBlobId: image_blob.signed_id,
      }

      result = DoubleGdpSchema.execute(
        poiImageUpload,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'poiImageUpload', 'landParcel', 'id')).to eq(user_parcel.id)
      expect(result['errors']).to be_nil
    end

    it 'raises an error if current-user is non-admin' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        id: user_parcel.id,
        imageBlobId: image_blob.signed_id,
      }

      result = DoubleGdpSchema.execute(
        poiImageUpload,
        variables: variables,
        context: {
          current_user: normal_user,
          site_community: normal_user.community,
        },
      ).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
