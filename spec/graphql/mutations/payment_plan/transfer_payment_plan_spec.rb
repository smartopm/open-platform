# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::TransferPaymentPlan do
  describe 'Transfers Payment Plan' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:account) { create(:account, user_id: user.id, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:land_parcel_account) do
      create(:land_parcel_account, land_parcel: land_parcel, account: account)
    end
    let!(:new_land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:land_parcel_account) do
      create(:land_parcel_account, land_parcel: new_land_parcel, account: account)
    end
    let!(:payment_plan) do
      create(
        :payment_plan,
        land_parcel_id: land_parcel.id,
        user_id: user.id,
        installment_amount: 100,
        duration: 12,
      )
    end
    let!(:transaction) do
      create(
        :transaction,
        user_id: user.id,
        community_id: community.id,
        depositor_id: user.id,
        amount: 500,
      )
    end
    let!(:plan_payment) do
      create(
        :plan_payment,
        user_id: user.id,
        community_id: community.id,
        transaction_id: transaction.id,
        payment_plan_id: payment_plan.id,
        amount: 500,
      )
    end

    let(:transfer_payment_plan) do
      <<-GQL
        mutation transferPaymentPlan(
          $paymentPlanId: ID!
          $landParcelId: ID!
        ) {
          transferPaymentPlan(paymentPlanId: $paymentPlanId, landParcelId: $landParcelId) {
            paymentPlan {
              id
              landParcel {
                parcelNumber
              }
            }
          }
        }
      GQL
    end
    describe '#resolve' do
      context 'when payment plan is not present for payment_plan id' do
        it 'raises payment plan not found error' do
          variables = {
            paymentPlanId: '1f7e1787-cd4f-44e5-847f-96f665c4dc5',
            landParcelId: new_land_parcel.id,
          }
          result = DoubleGdpSchema.execute(transfer_payment_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
        end
      end

      context 'when land parcel is not present for land parcel id' do
        it 'raises land parcel not found error' do
          variables = {
            paymentPlanId: payment_plan.id,
            landParcelId: '1f7e1787-cd4f-44e5-847f-96f665c4dc5',
          }
          result = DoubleGdpSchema.execute(transfer_payment_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Land parcel not found'
        end
      end

      context 'when land parcel id and payment plan id is valid' do
        it 'creates new payment plan and transfers plan payments to new payment plan' do
          variables = {
            paymentPlanId: payment_plan.id,
            landParcelId: new_land_parcel.id,
          }
          result = DoubleGdpSchema.execute(transfer_payment_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          payment_plan_id = result.dig('data', 'transferPaymentPlan', 'paymentPlan', 'id')
          plan = Properties::PaymentPlan.find(payment_plan_id)
          expect(plan.status).to eql('active')
          expect(plan.pending_balance).to eql(700.0)
          expect(plan.plan_payments.pluck(:status)).to include('paid')
          expect(payment_plan.reload.status).to eql('cancelled')
          expect(payment_plan.pending_balance).to eql(0.0)
          expect(payment_plan.plan_payments.pluck(:status)).to include('cancelled')
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            paymentPlanId: payment_plan.id,
            landParcelId: new_land_parcel.id,
          }
          result = DoubleGdpSchema.execute(transfer_payment_plan,
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
