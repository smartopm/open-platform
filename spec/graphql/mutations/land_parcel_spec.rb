# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LandParcel do
  describe 'creating a parcel number' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[can_create_land_parcel can_update_land_parcel])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }

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
          $ownershipFields: JSON
          $objectType: String
          $status: String
          $houseLandParcelId: ID) {
            PropertyCreate(parcelNumber: $parcelNumber,
            address1: $address1,
            address2: $address2,
            city: $city,
            postalCode: $postalCode,
            stateProvince: $stateProvince,
            parcelType: $parcelType,
            country: $country,
            ownershipFields: $ownershipFields
            objectType: $objectType
            status: $status
            houseLandParcelId: $houseLandParcelId) {
              landParcel {
                id
                objectType
                status
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
          $ownershipFields: JSON
          $objectType: String
          $status: String
          ) {
            propertyUpdate(id: $id,
            parcelNumber: $parcelNumber,
            address1: $address1,
            address2: $address2,
            city: $city,
            postalCode: $postalCode,
            stateProvince: $stateProvince,
            parcelType: $parcelType,
            country: $country,
            ownershipFields: $ownershipFields
            objectType: $objectType
            status: $status) {
              landParcel {
                id
                objectType
                status
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
        ownershipFields: [{ name: 'owner name',
                            address: 'owner address',
                            userId: current_user.id }],
      }

      result = DoubleGdpSchema.execute(propertyQuery, variables: variables,
                                                      context: {
                                                        current_user: current_user,
                                                        site_community: current_user.community,
                                                      }).as_json

      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'id')).not_to be_nil
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'objectType')).to eq('land')
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'status')).to eq('active')
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'fullName')).to eq(
        'owner name',
      )
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'accounts', 0, 'address1')).to eq(
        'owner address',
      )
      expect(result['errors']).to be_nil
    end

    it 'creates a house on a land parcel' do
      variables = {
        parcelNumber: '12345',
        address1: 'this is address1',
        address2: 'this is address2',
        city: 'this is city',
        postalCode: 'this is postal code',
        stateProvince: 'this is state province',
        parcelType: 'this is parcel type',
        objectType: 'house',
        status: 'planned',
        houseLandParcelId: user_parcel.id,
        country: 'this is a country',
        ownershipFields: [{ name: 'owner name',
                            address: 'owner address',
                            userId: current_user.id }],
      }

      result = DoubleGdpSchema.execute(propertyQuery, variables: variables,
                                                      context: {
                                                        current_user: current_user,
                                                        site_community: current_user.community,
                                                      }).as_json

      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'id')).not_to be_nil
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'objectType')).to eq('house')
      expect(result.dig('data', 'PropertyCreate', 'landParcel', 'status')).to eq('planned')
      expect(result['errors']).to be_nil
      house = current_user.community.land_parcels.find_by(parcel_number: '12345')
      expect(house.house_land_parcel_id).to eq(user_parcel.id)
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
        objectType: 'land',
        status: 'active',
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
      expect(parcel.accounts.first.full_name).to eq('new name')
      expect(parcel.object_type).to eq('land')
      expect(parcel.status).to eq('active')
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
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[can_merge_land_parcels])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }

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
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[
                            can_create_point_of_interest
                            can_delete_point_of_interest
                          ])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }
    let!(:normal_user) { create(:user_with_community, role: visitor_role) }

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

    let(:pointOfInterestCreateWithImagesQuery) do
      <<~GQL
        mutation PointOfInterestCreate(
          $longX: Float!,
          $latY: Float!,
          $geom: String!
          $imageBlobIds: [String!]) {
            pointOfInterestCreate(
            longX: $longX,
            latY: $latY,
            geom: $geom
            imageBlobIds: $imageBlobIds) {
              landParcel {
                id
                parcelType
                parcelNumber
                imageUrls
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
      expect(parcel.object_type).to eq('poi')
      expect(parcel.status).to eq('active')
      expect(parcel.geom).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'attaches image when creating point of interest' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_and_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )

      variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
        imageBlobIds: [image_blob.signed_id],
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestCreateWithImagesQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(result['errors']).to be_nil
      expect(result.dig(
               'data', 'pointOfInterestCreate', 'landParcel', 'parcelNumber'
             )).to match(/poi-\w+/i)
      expect(result.dig('data', 'pointOfInterestCreate', 'landParcel', 'parcelType')).to eq('poi')
      expect(result.dig(
               'data', 'pointOfInterestCreate', 'landParcel', 'imageUrls', 0
             )).to match(/test\.(jpg|jpeg)/)
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
      expect(parcel.object_type).to eq('poi')
      expect(parcel.status).to eq('active')
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
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[can_create_point_of_interest_image])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }
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
      image_blob = ActiveStorage::Blob.create_and_upload!(
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
      image_blob = ActiveStorage::Blob.create_and_upload!(
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

  describe 'updating a point of interest' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_land_parcel
                            can_create_point_of_interest
                            can_update_point_of_interest
                          ])
    end
    let!(:current_user) { create(:admin_user, role: admin_role) }
    let!(:normal_user) { create(:user_with_community, role: visitor_role) }

    let(:pointOfInterestUpdateQuery) do
      <<~GQL
        mutation PointOfInterestUpdate(
          $id: ID!,
          $longX: Float,
          $latY: Float,
          $geom: String,
          $imageBlobIds: [String!]) {
            pointOfInterestUpdate(
            id: $id,
            longX: $longX,
            latY: $latY,
            geom: $geom,
            imageBlobIds: $imageBlobIds) {
              success
          }
        }
      GQL
    end

    let(:pointOfInterestCreateWithImagesQuery) do
      <<~GQL
        mutation PointOfInterestCreate(
          $longX: Float!,
          $latY: Float!,
          $geom: String!
          $imageBlobIds: [String!]) {
            pointOfInterestCreate(
            longX: $longX,
            latY: $latY,
            geom: $geom
            imageBlobIds: $imageBlobIds) {
              landParcel {
                id
            }
          }
        }
      GQL
    end

    let(:single_poi_query) do
      %(query landParcel($id: ID!) {
        landParcel(id: $id) {
          id
          imageUrls
        }
      })
    end

    it 'updates correctly' do
      before_update = Properties::LandParcel.create!(
        community: current_user.community,
        parcel_number: 'POI-1234',
        parcel_type: 'poi',
        object_type: 'poi',
        long_x: 28.1234,
        lat_y: -15.1234,
        geom: '{
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [28.1234, -15.1234]},
          "properties": {
            "poi_name": "Lorem",
            "poi_description": "Lorem Ispum",
          }
        }',
      )

      variables = {
        id: before_update.id,
        longX: 28.4567,
        latY: -15.4567,
        imageBlobIds: [],
        geom: '{
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [28.4567, -15.4567]},
          "properties": {
            "poi_name": "Lorem updated",
            "poi_description": "Lorem ispum updated"
          }
        }',
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestUpdateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      after_update = Properties::LandParcel.find(before_update.id)
      geom_after_update = JSON.parse(after_update[:geom])

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'pointOfInterestUpdate', 'success')).to be(true)
      expect(after_update[:long_x]).to eq(variables[:longX])
      expect(after_update[:lat_y]).to eq(variables[:latY])
      expect(geom_after_update.dig('properties', 'poi_name')).to eq('Lorem updated')
      expect(geom_after_update.dig('properties', 'poi_description')).to eq('Lorem ispum updated')
    end

    it 'updates point of interests with attached images' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_and_upload!(
        io: file,
        filename: 'apple1.jpg',
        content_type: 'image/jpg',
      )

      poi_create_variables = {
        longX: 28.643219,
        latY: -15.50323,
        geom: '{"type": "feature"}',
        imageBlobIds: [image_blob.signed_id],
      }

      after_create = DoubleGdpSchema.execute(
        pointOfInterestCreateWithImagesQuery,
        variables: poi_create_variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      poi_id_to_update = after_create.dig('data', 'pointOfInterestCreate', 'landParcel', 'id')

      #  update poi images
      file_two = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob_two = ActiveStorage::Blob.create_and_upload!(
        io: file_two,
        filename: 'apple2.png',
        content_type: 'image/png',
      )

      variables = {
        id: poi_id_to_update,
        longX: 28.4567,
        latY: -15.4567,
        imageBlobIds: [image_blob_two.signed_id],
        geom: '{
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [28.4567, -15.4567]},
          "properties": {
            "poi_name": "Lorem updated",
            "poi_description": "Lorem ispum updated"
          }
        }',
      }

      DoubleGdpSchema.execute(
        pointOfInterestUpdateQuery,
        variables: variables,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      # verify image was updated
      updated_poi_data = DoubleGdpSchema.execute(
        single_poi_query,
        variables: { id: poi_id_to_update },
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(updated_poi_data.dig('data', 'landParcel', 'id')).to eq(poi_id_to_update)
      expect(updated_poi_data.dig('data', 'landParcel', 'imageUrls', 0)).to match(/apple2\.(png)/)
    end

    it 'throws unauthorized' do
      before_update = Properties::LandParcel.create!(
        community: current_user.community,
        parcel_number: 'POI-1234',
        parcel_type: 'poi',
        object_type: 'poi',
        long_x: 28.1234,
        lat_y: -15.1234,
        geom: '{
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [28.1234, -15.1234]},
          "properties": {
            "poi_name": "Lorem",
            "poi_description": "Lorem Ispum",
          }
        }',
      )

      variables = {
        id: before_update.id,
        longX: 28.4567,
        latY: -15.4567,
        imageBlobIds: [],
        geom: '{
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [28.4567, -15.4567]},
          "properties": {
            "poi_name": "Lorem updated",
            "poi_description": "Lorem ispum updated"
          }
        }',
      }

      result = DoubleGdpSchema.execute(
        pointOfInterestUpdateQuery,
        variables: variables,
        context: {
          current_user: normal_user,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
