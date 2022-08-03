# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::PlanPayment do
  describe 'Plan Payment queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'plan_payment',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_payments_list
                            can_fetch_payment_stat_details
                            can_access_all_payments
                          ])
    end
    let!(:user) do
      create(:user_with_community, ext_ref_id: '396745', email: 'demo@xyz.com',
                                   phone_number: '260123456', role: visitor_role)
    end
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let!(:land_parcel) do
      create(:land_parcel, community_id: community.id,
                           parcel_number: 'Plot001', parcel_type: 'Basic')
    end
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 1200, installment_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 500, receipt_number: '12345')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12345')
    end
    let!(:general_plan) { user.general_payment_plan }
    let!(:general_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan: user.general_payment_plan,
                            amount: 200)
    end
    let(:payment_list_query) do
      <<~GQL
        query paymentsList(
            $query: String,
            $limit: Int,
            $offset: Int
        ){
          paymentsList(
            query: $query,
            limit: $limit,
            offset: $offset
          ){
            amount
            receiptNumber
          }
        }
      GQL
    end

    let(:payment_receipt) do
      <<~GQL
        query paymentReceipt($userId: ID!, $id: ID!){
          paymentReceipt(userId: $userId, id: $id) {
            amount
            status
            createdAt
            receiptNumber
            currentPlotPendingBalance
            user {
              name
              extRefId
            }
            community {
              name
              currency
            }
            userTransaction {
              amount
              createdAt
            }
          }
        }
      GQL
    end

    let(:payment_stats_query) do
      <<~GQL
        query paymentStats($query: String){
          paymentStatDetails(query: $query){
            amount
            receiptNumber
            status
            createdAt
            userTransaction {
              source
              amount
            }
            user {
              name
              extRefId
            }
            paymentPlan {
              landParcel {
                parcelType
                parcelNumber
              }
            }
          }
        }
      GQL
    end

    describe '#payment_list' do
      shared_examples 'returns payments list' do |query|
        it 'returns list of payments' do
          variables = { query: query }
          result = DoubleGdpSchema.execute(payment_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          payment_details = result.dig('data', 'paymentsList', 0)
          expect(payment_details['amount']).to eql 500.0
          expect(payment_details['receiptNumber']).to eql 'MI12345'
        end
      end

      shared_examples 'returns empty list' do |query|
        it 'returns empty list' do
          variables = { query: query }
          result = DoubleGdpSchema.execute(payment_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('data', 'paymentsList')).to be_empty
        end
      end

      context 'when current user is not an admin' do
        it 'raises unauthorized error' do
          variables = { query: '500' }
          result = DoubleGdpSchema.execute(payment_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end

      context 'when payments are searched by existing amount' do
        include_examples 'returns payments list', '500'
      end

      context 'when payments are searched by not existing amount' do
        include_examples 'returns empty list', '200'
      end

      context 'when payments are searched by existing land parcel number' do
        include_examples 'returns payments list', 'Plot001'
      end

      context 'when payments are searched by not existing land parcel number' do
        include_examples 'returns empty list', 'property-one'
      end

      context 'when payments are searched by existing land parcel type' do
        include_examples 'returns payments list', 'Basic'
      end

      context 'when payments are searched by non existing land parcel type' do
        include_examples 'returns empty list', 'Premium'
      end

      context 'when payments are searched by existing user nrc' do
        include_examples 'returns payments list', '396745'
      end

      context 'when payments are searched by non existing nrc' do
        include_examples 'returns empty list', '7895'
      end

      context 'when payments are searched by receipt number' do
        include_examples 'returns payments list', '12345'
      end

      context 'when payments are searched by non existing receipt number' do
        include_examples 'returns empty list', '7895'
      end

      context 'when payments are searched by existing user name' do
        include_examples 'returns payments list', 'Mark Test'
      end

      context 'when payments are searched by non existing user name' do
        include_examples 'returns empty list', 'John Test'
      end

      context 'when payments are searched by existing user email' do
        include_examples 'returns payments list', 'demo@xyz.com'
      end

      context 'when payments are searched by non existing user email' do
        include_examples 'returns empty list', 'test@xyz.com'
      end

      context 'when payments are searched by existing user phone number' do
        include_examples 'returns payments list', '260123456'
      end

      context 'when payments are searched by non existing user phone number' do
        include_examples 'returns empty list', '260987654'
      end

      context 'when payments are searched by existing source' do
        include_examples 'returns payments list', 'cash'
      end

      context 'when payments are searched by non existing source' do
        include_examples 'returns empty list', 'mobile_money'
      end

      context 'when payments are searched for a valid date' do
        include_examples 'returns payments list', Time.zone.today.to_s
      end

      context 'when payments are searched between a valid range' do
        include_examples 'returns payments list',
                         "created_at >= #{Time.zone.today} AND created_at <= #{Time.zone.today}"
      end
    end

    describe '#payment_receipt' do
      context 'when payment id is invalid' do
        it 'raises transaction not found error' do
          variables = { userId: user.id, id: '1234' }
          result = DoubleGdpSchema.execute(payment_receipt,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message')).to eql 'Payment not found'
        end
      end

      context 'when current_user is verified' do
        before { payment_plan.update(pending_balance: 1200) }

        it 'return payment receipt details' do
          variables = { userId: user.id, id: plan_payment.id }
          result = DoubleGdpSchema.execute(payment_receipt,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          receipt_details = result.dig('data', 'paymentReceipt')
          expect(receipt_details['amount']).to eql 500.0
          expect(receipt_details['status']).to eql 'paid'
          expect(receipt_details['currentPlotPendingBalance']).to eql 700.0
          expect(receipt_details['receiptNumber']).to eql 'MI12345'
          expect(receipt_details['user']['name']).to eql 'Mark Test'
          expect(receipt_details['userTransaction']['amount']).to eql 500.0
        end
      end
    end

    describe '#payment_stat_details' do
      context 'when query is given for a time period' do
        it 'returns payments made during the time period' do
          variables = { query: 'today' }
          result = DoubleGdpSchema.execute(payment_stats_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('data', 'paymentStatDetails').size).to eql 1
          payment_stat_details = result.dig('data', 'paymentStatDetails', 0)
          expect(payment_stat_details['receiptNumber']).to eql 'MI12345'
          expect(payment_stat_details['status']).to eql 'paid'
          expect(payment_stat_details['createdAt'].to_date).to eql plan_payment.created_at.to_date
          expect(payment_stat_details['amount']).to eql 500.0
          expect(payment_stat_details['userTransaction']['source']).to eql 'cash'
          expect(payment_stat_details['userTransaction']['amount']).to eql 500.0
          expect(payment_stat_details['user']['name']).to eql 'Mark Test'
          expect(payment_stat_details['user']['extRefId']).to eql '396745'
          expect(
            payment_stat_details['paymentPlan']['landParcel']['parcelNumber'],
          ).to eql 'Plot001'
          expect(
            payment_stat_details['paymentPlan']['landParcel']['parcelType'],
          ).to eql 'Basic'
        end
      end
    end
  end
end
