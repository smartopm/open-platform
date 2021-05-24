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
                            monthly_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 500)
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500)
    end

    let(:plan_payment_cancel) do
      <<~GQL
        mutation PlanPaymentCancel(
          $planPaymentId: ID!
        ){
          planPaymentCancel(
            planPaymentId: $planPaymentId
          ){
            cancelledPlanPayment{
              status
              paymentPlan{
                pendingBalance
              }
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when plan payment id in invalid' do
        it 'raises not found error' do
          variables = {
            planPaymentId: '123',
          }
          result = DoubleGdpSchema.execute(plan_payment_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'not found'
        end
      end

      context 'when plan payment id is valid' do
        before do
          payment_plan.update_pending_balance(plan_payment.amount, :settle)
        end
        it 'cancels the payment and update the plan pending balance' do
          variables = {
            planPaymentId: plan_payment.id,
          }
          result = DoubleGdpSchema.execute(plan_payment_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json

          plan_payment_result = result.dig('data', 'planPaymentCancel', 'cancelledPlanPayment')
          expect(plan_payment_result['status']).to eql 'cancelled'
          expect(plan_payment_result['paymentPlan']['pendingBalance']).to eql 1200.0
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            planPaymentId: plan_payment.id,
          }
          result = DoubleGdpSchema.execute(plan_payment_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
