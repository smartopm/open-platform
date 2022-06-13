# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::PaymentPlanCancel do
  describe 'payment plan cancel' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_cancel_payment_plan])
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
    let(:payment_plan_cancel) do
      <<~GQL
        mutation PaymentPlanCancel(
          $id: ID!
          $userId: ID!
        ){
          paymentPlanCancel(
            id: $id
            userId: $userId
          ){
            paymentPlan{
              id
              status
              pendingBalance
              renewable
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when  user id or payment plan id in invalid' do
        it 'raises not found error' do
          variables = {
            id: payment_plan.id,
            userId: '123',
          }
          result = DoubleGdpSchema.execute(payment_plan_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'not found'
        end

        it 'raises not found error' do
          variables = {
            id: '123',
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(payment_plan_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'Payment Plan not found'
        end
      end

      context 'when user id or payment plan id is valid' do
        # before do
        #   payment_plan.update_pending_balance(plan_payment.amount, :settle)
        # end
        it 'cancels the payment plan and update the plan pending balance and status' do
          variables = {
            id: payment_plan.id,
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(payment_plan_cancel,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json

          payment_plan_result = result.dig('data', 'paymentPlanCancel', 'paymentPlan')
          expect(payment_plan_result['status']).to eql 'cancelled'
          expect(payment_plan_result['pendingBalance']).to eql 0.0
          expect(payment_plan_result['renewable']).to eql false
          expect(result['errors']).to be_nil
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            id: payment_plan.id,
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(payment_plan_cancel,
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
