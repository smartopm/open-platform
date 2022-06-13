# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::LandParcel do
  describe 'parcel queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'land_parcel',
                          role: admin_role,
                          permissions: %w[
                            can_view_all_land_parcels can_fetch_land_parcels_with_plans
                            can_fetch_land_parcels can_fetch_land_parcel can_fetch_house
                          ])
    end

    let!(:current_user) { create(:user_with_community, role: visitor_role) }
    let!(:another_user) { create(:user_with_community, role: visitor_role) }
    let!(:admin_user) do
      create(:admin_user, community_id: current_user.community_id,
                          role: admin_role)
    end

    let!(:community) { current_user.community }
    let!(:another_community) { another_user.community }
    let!(:account) { create(:account, user: current_user, community: community) }
    let!(:land_parcel) do
      current_user.community.land_parcels.create(address1: 'This address',
                                                 parcel_number: 'basic-123',
                                                 parcel_type: 'basic',
                                                 long_x: 28.234,
                                                 lat_y: -15.234)
    end
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: current_user.id,
                            installment_amount: 100, start_date: '2021-08-01')
    end

    let!(:another_payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: admin_user.id,
                            installment_amount: 300, start_date: '2021-02-01')
    end
    let!(:transaction) do
      create(:transaction, user_id: current_user.id, community_id: community.id,
                           depositor_id: current_user.id, amount: 500,
                           receipt_number: '12300')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: current_user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12300')
    end
    let!(:other_transaction) do
      create(:transaction, user_id: admin_user.id, community_id: community.id,
                           depositor_id: admin_user.id, amount: 700, receipt_number: '12301',
                           status: 'cancelled')
    end
    let!(:other_plan_payment) do
      create(:plan_payment, user_id: admin_user.id, community_id: community.id,
                            transaction_id: other_transaction.id,
                            payment_plan_id: another_payment_plan.id,
                            amount: 700, manual_receipt_number: '12301', status: 'cancelled')
    end

    let(:fetch_land_parcel_query) do
      %(query {
        fetchLandParcel {
          id
          address1
          longX
          latY
          imageUrls
          accounts {
            id
          }
          paymentPlans{
            id
            startDate
            user{
              name
            }
            planPayments{
              amount
            }
          }
        }
        })
    end
    let(:land_parcel_geo_data_query) do
      %(query landParcelGeoData {
        landParcelGeoData {
          id
          parcelNumber
        }
      })
    end

    it 'should retrieve list of all land parcels' do
      result = DoubleGdpSchema.execute(fetch_land_parcel_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('data', 'fetchLandParcel').length).to eql 1
      expect(result.dig('data', 'fetchLandParcel', 0, 'id')).to eql land_parcel.id
      expect(result.dig('data', 'fetchLandParcel', 0, 'address1')).to eql 'This address'
      expect(result.dig('data', 'fetchLandParcel', 0, 'longX')).to eql 28.234
      expect(result.dig('data', 'fetchLandParcel', 0, 'latY')).to eql(-15.234)
      expect(result.dig('data', 'fetchLandParcel', 0, 'paymentPlans').size).to eql 2
      first_plan_result = result.dig('data', 'fetchLandParcel', 0, 'paymentPlans', 0)
      expect([payment_plan.id, another_payment_plan.id]).to include(first_plan_result['id'])
      second_plan_result = result.dig('data', 'fetchLandParcel', 0, 'paymentPlans', 1)
      expect([payment_plan.id, another_payment_plan.id]).to include(second_plan_result['id'])
    end

    it 'should not retrieve list of all land parcels if user is not admin' do
      result = DoubleGdpSchema.execute(fetch_land_parcel_query,
                                       context: {
                                         current_user: current_user,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should raise unauthorized error when no current-user' do
      result = DoubleGdpSchema.execute(fetch_land_parcel_query,
                                       context: {
                                         current_user: nil,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('data', 'fetchLandParcel')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should raise unauthorized error when no current-user for land parcel geo data' do
      result = DoubleGdpSchema.execute(land_parcel_geo_data_query,
                                       context: {
                                         current_user: nil,
                                         site_community: admin_user.community,
                                       }).as_json
      expect(result.dig('data', 'landParcelGeoData')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should no land parcel geo data when community is wrong' do
      result = DoubleGdpSchema.execute(land_parcel_geo_data_query,
                                       context: {
                                         current_user: admin_user,
                                         site_community: another_community,
                                       }).as_json
      expect(result.dig('data', 'landParcelGeoData')).to eql []
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    describe 'land_parcel' do
      let(:land_parcel_query) do
        %(query {
          landParcel(id: "#{land_parcel.id}") {
            id
            address1
            imageUrls
            accounts {
              id
            }
            paymentPlans{
              id
              planPayments{
                id
              }
            }
          }
          })
      end

      context 'when current-user is an admin' do
        it 'should return a single land parcel by id' do
          result = DoubleGdpSchema.execute(land_parcel_query,
                                           context: {
                                             current_user: admin_user,
                                             site_community: admin_user.community,
                                           }).as_json
          expect(result.dig('data', 'landParcel', 'id')).to eql land_parcel.id
        end
      end

      context 'when no current-user is not an admin' do
        it 'should raise an unauthorized error' do
          result = DoubleGdpSchema.execute(land_parcel_query,
                                           context: {
                                             current_user: current_user,
                                             site_community: current_user.community,
                                           }).as_json

          expect(result.dig('data', 'landParcel')).to be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe 'Fetch House' do
      let(:fetch_house_query) do
        %(query house($query: String, $limit: Int, $offset: Int) {
          fetchHouse(query: $query, limit: $limit, offset: $offset) {
            id
            parcelNumber
            paymentPlans{
              id
            }
          }
        })
      end
      it 'should raise an unauthorized error' do
        result = DoubleGdpSchema.execute(fetch_house_query,
                                         context: {
                                           current_user: another_user,
                                           site_community: current_user.community,
                                         }).as_json

        expect(result.dig('data', 'fetchHouse')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end

      it 'should return no houses for a wrong community' do
        result = DoubleGdpSchema.execute(fetch_house_query,
                                         context: {
                                           current_user: admin_user,
                                           site_community: another_user.community,
                                         }).as_json

        expect(result.dig('data', 'fetchHouse')).to eql []
        expect(result.dig('errors', 0, 'message')).to be_nil
      end

      context 'when house is searched' do
        before { land_parcel.house! }

        it 'should return houses which matches with the search query' do
          variables = { query: 'basic' }
          result = DoubleGdpSchema.execute(fetch_house_query, variables: variables,
                                                              context: {
                                                                current_user: admin_user,
                                                                site_community: community,
                                                              }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'fetchHouse', 0, 'parcelNumber')).to eql 'basic-123'
        end
      end
    end

    describe 'user_land_parcels' do
      let!(:land_parcel_2) { create(:land_parcel, community_id: current_user.community_id) }
      let!(:payment_plan) do
        create(:payment_plan, land_parcel_id: land_parcel.id,
                              user_id: current_user.id, installment_amount: 10, duration: 1)
      end

      let(:user_land_parcels_query) do
        %(query {
            userLandParcels(userId: "#{current_user.id}"){
              id
              accounts{
                id
              }
            }
          })
      end

      let(:user_land_parcel_with_plan_query) do
        %(query {
            userLandParcelWithPlan(userId: "#{current_user.id}"){
              id
              landParcel{
                parcelNumber
              }
            }
          })
      end

      let!(:land_parcel_account) do
        create(:land_parcel_account, land_parcel_id: land_parcel.id, account_id: account.id)
      end

      let!(:land_parcel_account_2) do
        create(:land_parcel_account, land_parcel_id: land_parcel_2.id, account_id: account.id)
      end

      it 'should return a single land parcel by id' do
        result = DoubleGdpSchema.execute(user_land_parcels_query,
                                         context: {
                                           current_user: admin_user,
                                           site_community: admin_user.community,
                                         }).as_json
        expect(result.dig('data', 'userLandParcels', 1, 'id')).to eql land_parcel.id
        expect(result.dig('data', 'userLandParcels').count).to eql 2
      end

      it 'should return a single payment plan by id' do
        result = DoubleGdpSchema.execute(user_land_parcel_with_plan_query,
                                         context: {
                                           current_user: admin_user,
                                           site_community: admin_user.community,
                                         }).as_json
        expect(result.dig('data', 'userLandParcelWithPlan', 0, 'id')).to eql payment_plan.id
        expect(result.dig('data', 'userLandParcelWithPlan').count).to eql 1
      end
    end
  end
end
