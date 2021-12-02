# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::AllocateGeneralFunds do
  describe 'Allocate general funds' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_allocate_general_funds])
    end
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let!(:account) { create(:account, user_id: user.id, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(
        :payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, installment_amount: 100,
                       duration: 12
      )
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 200)
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 200, manual_receipt_number: '13975')
    end
    let(:general_fund) { user.general_payment_plan }
    let(:allocate_general_funds) do
      <<-GQL
        mutation allocateGeneralFunds(
          $paymentPlanId: ID!
        ) {
          allocateGeneralFunds(paymentPlanId: $paymentPlanId) {
            success
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when payment plan is not present' do
        it 'raises payment plan not found error' do
          variables = { paymentPlanId: '1f7e1787-cd4f-44e5-847f-96f665c4dc5' }
          result = DoubleGdpSchema.execute(allocate_general_funds,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
        end
      end

      context 'when payment plan is not active' do
        before { payment_plan.cancelled! }
        it 'raises funds cannot be allocated error' do
          variables = { paymentPlanId: payment_plan.id }
          result = DoubleGdpSchema.execute(allocate_general_funds,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(
            result.dig('errors', 0, 'message'),
          ).to eql 'Funds can only be allocated to active payment plans'
        end
      end

      context 'when user does not have general funds' do
        it 'raises user does not have general funds error' do
          variables = { paymentPlanId: payment_plan.id }
          result = DoubleGdpSchema.execute(allocate_general_funds,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(
            result.dig('errors', 0, 'message'),
          ).to eql 'The user does not have general funds to allocate it to a payment plan'
        end
      end

      context 'when general fund have no payments' do
        before { general_fund }
        it 'raises user does not have general funds error' do
          variables = { paymentPlanId: payment_plan.id }
          result = DoubleGdpSchema.execute(allocate_general_funds,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(
            result.dig('errors', 0, 'message'),
          ).to eql 'The user does not have general funds to allocate it to a payment plan'
        end
      end

      context 'when general fund have paid payments' do
        before do
          general_fund
          plan_payment.update!(payment_plan: general_fund)
        end
        it 'alloactes the general funds to the payment plan' do
          variables = { paymentPlanId: payment_plan.id }
          result = DoubleGdpSchema.execute(allocate_general_funds,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'allocateGeneralFunds', 'success')).to eql true
          expect(payment_plan.reload.pending_balance.to_f).to eql 1000.0
          expect(plan_payment.reload.payment_plan_id).to eql payment_plan.id
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = { paymentPlanId: payment_plan.id }
          result = DoubleGdpSchema.execute(allocate_general_funds,
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
