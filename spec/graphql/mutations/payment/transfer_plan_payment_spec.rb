# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::TransferPaymentPlan do
  describe 'Transfers Plan Payment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'plan_payment',
                          role: admin_role,
                          permissions: %w[can_transfer_plan_payment])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:other_land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            installment_amount: 100, duration: 12)
    end
    let!(:other_payment_plan) do
      create(:payment_plan, land_parcel_id: other_land_parcel.id, user_id: user.id,
                            installment_amount: 100, duration: 4)
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

    let(:transfer_plan_payment) do
      <<-GQL
        mutation transferPlanPayment(
          $paymentId: ID!
          $destinationPlanId: ID!
        ) {
          transferPlanPayment(paymentId: $paymentId, destinationPlanId: $destinationPlanId) {
            payment {
              id
              status
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when payment id is invalid' do
        it 'raises payment not found error' do
          variables = {
            paymentId: 'axd-e878',
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Payment not found'
        end
      end

      context 'when payment is cancelled' do
        before { plan_payment.update(status: :cancelled) }
        it 'raises cannot transfer payment error' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Transfer of cancelled payment '\
                'cannot be done'
        end
      end

      context 'when destination plan id is invalid' do
        it 'raise payment plan not found error' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: 'axd-e878',
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
        end
      end

      context 'when destination plan is cancelled' do
        before { other_payment_plan.update(status: :cancelled) }
        it 'raise transfer of payment cannot be processed error' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Transfer of payment cannot be made' \
                    ' to non-active payment plan. Please try transferring to other plans'
        end
      end

      context 'when payment amount is less or equal than pending balance of desyination plan' do
        before { payment_plan.update(pending_balance: 1000.0) }
        it 'transfers the payment to the destination plan' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'transferPlanPayment', 'payment', 'status')).to eql 'cancelled'
          new_payment = other_payment_plan.plan_payments.first
          expect(new_payment.status).to eql 'paid'
          expect(new_payment.amount.to_f).to eql 200.0
          expect(new_payment.manual_receipt_number).to eql 'MI13975'
          expect(payment_plan.reload.pending_balance.to_f).to eql 1200.0
        end
      end

      context 'when payment amount is more than the pending balance of destination plan' do
        before do
          other_payment_plan.update(pending_balance: 100)
          payment_plan.update(pending_balance: 1000.0)
        end
        it 'transfers the payment to the destination plan and allocates the additional amount to
        general fund' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'transferPlanPayment', 'payment', 'status')).to eql 'cancelled'
          new_payment = other_payment_plan.plan_payments.first
          expect(new_payment.status).to eql 'paid'
          expect(new_payment.amount.to_f).to eql 100.0
          expect(new_payment.manual_receipt_number).to eql 'MI13975-1'
          general_payment = user.general_payment_plan.plan_payments.first
          expect(general_payment.status).to eql 'paid'
          expect(general_payment.amount.to_f).to eql 100.0
          expect(general_payment.manual_receipt_number).to eql 'MI13975-2'
          expect(payment_plan.reload.pending_balance.to_f).to eql 1200.0
        end
      end

      context 'when destination plan pending balance is 0' do
        before do
          other_payment_plan.update(pending_balance: 0)
          payment_plan.update(pending_balance: 1000.0)
        end
        it 'transfers the payment amount to the general fund' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to be_nil
          expect(result.dig('data', 'transferPlanPayment', 'payment', 'status')).to eql 'cancelled'
          general_payment = user.general_payment_plan.plan_payments.first
          expect(general_payment.status).to eql 'paid'
          expect(general_payment.amount.to_f).to eql 200.0
          expect(general_payment.manual_receipt_number).to eql 'MI13975'
          expect(payment_plan.reload.pending_balance.to_f).to eql 1200.0
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            paymentId: plan_payment.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_plan_payment,
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
