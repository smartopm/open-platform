# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionCreate do
  describe 'create transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'transaction',
                          role: admin_role,
                          permissions: %w[can_create_transaction])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, status: 'active',
                            installment_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 200, status: 'cancelled')
    end
    let!(:plan_payment) do
      create(
        :plan_payment, user_id: user.id, community_id: community.id,
                       transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                       amount: 200, manual_receipt_number: '13975', status: 'cancelled'
      )
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

      context 'when an existing receipt number of a cancelled payment is entered' do
        it 'creates the transaction and payment entry without raising error' do
          variables = {
            userId: user.id,
            amount: 200,
            source: 'cash',
            paymentsAttributes: [{
              paymentPlanId: payment_plan.id,
              amount: 200,
              receiptNumber: '13975',
            }],
          }
          result = DoubleGdpSchema.execute(transaction_create_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          transaction_result = result.dig('data', 'transactionCreate', 'transaction')
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(transaction_result['source']).to eql 'cash'
          expect(transaction_result['amount']).to eql 200.0
          expect(transaction_result['status']).to eql 'accepted'
          plan_payment = transaction_result['planPayments'][0]
          expect(plan_payment['createdAt']).to eql transaction_result['createdAt']
          expect(plan_payment['receiptNumber']).to eql 'MI13975'
          expect(plan_payment['amount']).to eql 200.0
          expect(plan_payment['paymentPlan']['pendingBalance']).to eql 1000.0
        end
      end

      context 'when payment amount is more than the pending balance' do
        it 'splits the payment and allocates the overpay amount to general plan' do
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
          expect(result.dig('errors', 0, 'message')).to be_nil
          transaction_result = result.dig('data', 'transactionCreate', 'transaction')
          expect(transaction_result['amount']).to eql 5000.0
          plan_payment = transaction_result['planPayments'][0]
          expect(plan_payment['amount']).to eql 1200.0
          general_payments = user.general_payment_plan.plan_payments.reload
          expect(general_payments[0].amount).to eql 3800.0
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
          expect(plan_payment['paymentPlan']['pendingBalance']).to eql 1100.0
          expect(plan_payment['paymentPlan']['status']).to eql 'active'

          other_plan_payment = transaction_result['planPayments'][1]
          expect(other_plan_payment['createdAt']).to eql transaction_result['createdAt']
          expect(other_plan_payment['amount']).to eql 50.0
          expect(other_plan_payment['receiptNumber']).to eql 'MI12346'
          expect(other_plan_payment['paymentPlan']['pendingBalance']).to eql 2350.0
          expect(other_plan_payment['paymentPlan']['status']).to eql 'active'
          expect(result.dig('errors', 0, 'message')).to eql nil
        end
      end
    end
  end
end
