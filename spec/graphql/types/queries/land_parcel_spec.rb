# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::LandParcel do
  describe 'parcel queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:land_parcel) do
      current_user.community.land_parcels.create(address1: 'This address')
    end

    let!(:admin_user) { create(:admin_user, community_id: current_user.community.id) }
    let(:parcel_query) do
      %(query {
        fetchLandParcel {
          id
          address1
        }
        })
    end

    it 'should retrieve list of all land parcels' do
      result = DoubleGdpSchema.execute(parcel_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('data', 'fetchLandParcel').length).to eql 1
      expect(result.dig('data', 'fetchLandParcel', 0, 'id')).to eql land_parcel.id
      expect(result.dig('data', 'fetchLandParcel', 0, 'address1')).to eql 'This address'
    end

    describe 'land_parcel' do
      let(:parcel_query) do
        %(query {
          landParcel(id: "#{land_parcel.id}") {
            id
            address1
          }
          })
      end

      context 'when current-user is an admin' do
        it 'should return a single land parcel by id' do
          result = DoubleGdpSchema.execute(parcel_query,
                                          context: {
                                            current_user: admin_user,
                                            site_community: admin_user.community,
                                          }).as_json

          puts result
          expect(result.dig('data', 'landParcel', 'id')).to eql land_parcel.id
        end
      end

      context 'when current-user is not an admin' do
        it 'should raise an unauthorized error' do
          result = DoubleGdpSchema.execute(parcel_query,
                                          context: {
                                            current_user: current_user,
                                            site_community: current_user.community,
                                          }).as_json

          expect(result.dig('data', 'landParcel')).to be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
