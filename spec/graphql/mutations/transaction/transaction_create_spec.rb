# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionCreate do
  describe 'create transaction' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, status: 'active',
                            installment_amount: 100)
    end
    let!(:other_payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, status: 'active',
                            installment_amount: 200)
    end
    let(:transaction_create_mutation) do
      <<~GQL
        mutation TransactionCreate(
          $userId: ID!,
          $amount: Float!,
          $source: String!,
          $transactionNumber: String,
          $paymentsAttributes: [PlanPaymentInput!]!
        ){
          transactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source,
            transactionNumber: $transactionNumber,
            paymentsAttributes: $paymentsAttributes
          ){ 
            transaction{
              source
              transactionNumber
              amount
              status
              createdAt
              planPayments{
                createdAt
                amount
                receiptNumber
                automatedReceiptNumber
                currentPlotPendingBalance
                paymentPlan{
                  pendingBalance
                  status
                }
              }
            }
          }
        }
      GQL
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            userId: user.id,
            amount: 100,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 100,
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe '#resolve' do
      context 'when transaction amount is not equal to sum of all amounts allocated for plans' do
        it 'raises mismatch amount error' do
          variables = {
            userId: user.id,
            amount: 200,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 100,
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message'))
            .to eql 'Amount must be equal to sum of all amounts allocated to plans'
        end
      end

      context 'when payment plan id is invalid' do
        it 'raises payment plan does not exist error' do
          variables = {
            userId: user.id,
            amount: 100,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: 'lexe458',
              amount: 100,
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message'))
            .to eql 'Payment Plan not found'
        end
      end

      context 'when receipt number already exists' do
        it 'raises receipt number already exists error' do
          variables = {
            userId: user.id,
            amount: 150,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 100,
              receiptNumber: '12345',
            }, {
              paymentPlanId: other_payment_plan.id,
              amount: 50,
              receiptNumber: '12345',
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message'))
            .to eql 'Receipt number already exists'
        end
      end

      context 'when payment amount is more than the pending balance' do
        it 'raises amount greater than pending balance error' do
          variables = {
            userId: user.id,
            amount: 5000,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 5000,
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message'))
            .to eql 'Amount cannot be greater than the plan pending balance'
        end
      end

      context 'when amount is equal to sum of all plan allocated amounts' do
        it "creates transaction, plan payment and updates payment plan's pending balance" do
          variables = {
            userId: user.id,
            amount: 150,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 100,
              receiptNumber: '12345',
            }, {
              paymentPlanId: other_payment_plan.id,
              amount: 50,
              receiptNumber: '12346',
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })

          transaction_result = result.dig('data', 'transactionCreate', 'transaction')
          expect(transaction_result['source']).to eql 'cash'
          expect(transaction_result['amount']).to eql 150.0
          expect(transaction_result['status']).to eql 'accepted'

          plan_payment = transaction_result['planPayments'][0]
          expect(plan_payment['createdAt']).to eql transaction_result['createdAt']
          expect(plan_payment['receiptNumber']).to eql 'MI12345'
          expect(plan_payment['amount']).to eql 100.0
          expect(plan_payment['currentPlotPendingBalance']).to eql 1100.0
          expect(plan_payment['automatedReceiptNumber']).not_to be_nil
          expect(plan_payment['paymentPlan']['pendingBalance']).to eql 1100.0
          expect(plan_payment['paymentPlan']['status']).to eql 'active'

          other_plan_payment = transaction_result['planPayments'][1]
          expect(other_plan_payment['createdAt']).to eql transaction_result['createdAt']
          expect(other_plan_payment['amount']).to eql 50.0
          expect(other_plan_payment['receiptNumber']).to eql 'MI12346'
          expect(other_plan_payment['currentPlotPendingBalance']).to eql 2350.0
          expect(other_plan_payment['paymentPlan']['pendingBalance']).to eql 2350.0
          expect(other_plan_payment['paymentPlan']['status']).to eql 'active'
          expect(result.dig('errors', 0, 'message')).to eql nil
        end
      end
    end
  end
end
