# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionCreate do
  describe 'create transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'plan_payment',
                          role: admin_role,
                          permissions: %w[can_cancel_plan_payment])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            installment_amount: 100)
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
          $id: ID!
        ){
          planPaymentCancel(
            id: $id
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
      context 'when payment id in invalid' do
        it 'raises not found error' do
          variables = {
            id: '123',
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

      context 'when payment id is valid' do
        before do
          payment_plan.update_pending_balance(plan_payment.amount, :settle)
        end
        it 'cancels the payment and update the plan pending balance' do
          variables = {
            id: plan_payment.id,
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
            id: plan_payment.id,
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
