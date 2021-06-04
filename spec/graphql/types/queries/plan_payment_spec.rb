# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::PlanPayment do
  describe 'Plan Payment queries' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 1200, monthly_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1500, receipt_number: '12345')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12345')
    end
    let(:payment_receipt) do
      <<~GQL
        query paymentReceipt($id: ID!){
          paymentReceipt(id: $id) {
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

    describe '#payment_receipt' do
      context 'when payment id is invalid' do
        it 'raises transaction not found error' do
          variables = { id: '1234' }
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

        it 'return transaction receipt details' do
          variables = { id: plan_payment.id }
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
          expect(receipt_details['userTransaction']['amount']).to eql 1500.0
        end
      end
    end
  end
end
