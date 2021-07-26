# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionCreate do
  describe 'create transaction' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 1200, installment_amount: 100, status: 'active')
    end
    let!(:second_land_parcel) { create(:land_parcel, community_id: community.id) }

    let(:transaction_create_mutation) do
      <<~GQL
        mutation TransactionCreate(
          $userId: ID!,
          $amount: Float!,
          $source: String!,
          $paymentPlanId: ID!,
          $transactionNumber: String,
          $receiptNumber: String
        ){
          transactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source,
            paymentPlanId: $paymentPlanId,
            transactionNumber: $transactionNumber
            receiptNumber: $receiptNumber
          ){ 
            transaction{
              source
              transactionNumber
              amount
              status
              createdAt
              planPayments{
                createdAt
                receiptNumber
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
            paymentPlanId: payment_plan.id,
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
      context 'when all required details are provided' do
        context 'when payment plan id is invalid' do
          it 'raises payment plan does not exist error' do
            variables = {
              userId: user.id,
              amount: 2000,
              source: 'cash',
              paymentPlanId: 'lexe458',
              receiptNumber: '1001',
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

        context 'when pending balance is 0 for payment plan' do
          before { payment_plan.update(pending_balance: 0) }

          it 'raises pending balance is 0 for this property error' do
            variables = {
              userId: user.id,
              amount: 2000,
              source: 'cash',
              paymentPlanId: payment_plan.id,
              receiptNumber: '1001',
            }
            result = DoubleGdpSchema.execute(transaction_create_mutation,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             })
            expect(result.dig('errors', 0, 'message'))
              .to eql 'Pending balance is 0 for payment plan of selected property'
          end
        end

        context "when amount is more than the payment plan's pending balance" do
          before { payment_plan.update(pending_balance: 1200) }

          it "creates transaction, plan payment and updates payment plan's pending balance to 0" do
            variables = {
              userId: user.id,
              amount: 2000,
              source: 'cash',
              paymentPlanId: payment_plan.id,
              receiptNumber: '1001',
            }
            result = DoubleGdpSchema.execute(transaction_create_mutation,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             })
            transaction_result = result.dig('data', 'transactionCreate', 'transaction')
            expect(transaction_result['source']).to eql 'cash'
            expect(transaction_result['amount']).to eql 2000.0
            expect(transaction_result['status']).to eql 'accepted'
            plan_payment = transaction_result['planPayments'][0]
            expect(plan_payment['createdAt']).to eql transaction_result['createdAt']
            expect(plan_payment['receiptNumber']).to eql 'MI1001'
            expect(plan_payment['currentPlotPendingBalance']).to eql 0.0
            expect(plan_payment['paymentPlan']['pendingBalance']).to eql 0.0
            expect(plan_payment['paymentPlan']['status']).to eql 'completed'
          end
        end

        context "when amount is less than or equal to payment plan's pending balance" do
          before { payment_plan.update(pending_balance: 1200) }

          it "creates transaction, plan payment and updates payment plan's pending balance" do
            variables = {
              userId: user.id,
              amount: 100,
              source: 'cash',
              paymentPlanId: payment_plan.id,
              receiptNumber: '1001',
            }
            result = DoubleGdpSchema.execute(transaction_create_mutation,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             })
            transaction_result = result.dig('data', 'transactionCreate', 'transaction')
            expect(transaction_result['source']).to eql 'cash'
            expect(transaction_result['amount']).to eql 100.0
            expect(transaction_result['status']).to eql 'accepted'

            plan_payment = transaction_result['planPayments'][0]
            expect(plan_payment['createdAt']).to eql transaction_result['createdAt']
            expect(plan_payment['receiptNumber']).to eql 'MI1001'
            expect(plan_payment['currentPlotPendingBalance']).to eql 1100.0
            expect(plan_payment['paymentPlan']['pendingBalance']).to eql 1100.0
            expect(plan_payment['paymentPlan']['status']).to eql 'active'
          end
        end
      end
    end
  end
end
