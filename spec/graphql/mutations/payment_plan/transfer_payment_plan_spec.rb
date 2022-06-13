# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::TransferPaymentPlan do
  describe 'Transfers Payment Plan' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_transfer_payment_plan])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:community) { user.community }
    let!(:account) { create(:account, user_id: user.id, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:land_parcel_account) do
      create(:land_parcel_account, land_parcel: land_parcel, account: account)
    end
    let!(:other_land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:other_parcel_account) do
      create(:land_parcel_account, land_parcel: other_land_parcel, account: account)
    end
    let!(:payment_plan) do
      create(
        :payment_plan,
        land_parcel_id: land_parcel.id,
        user_id: user.id,
        installment_amount: 100,
        duration: 20,
      )
    end
    let!(:other_payment_plan) do
      create(
        :payment_plan,
        land_parcel_id: other_land_parcel.id,
        user_id: user.id,
        installment_amount: 100,
        duration: 4,
      )
    end
    let!(:transaction) do
      create(
        :transaction,
        user_id: user.id,
        community_id: community.id,
        depositor_id: user.id,
        amount: 200,
      )
    end
    let!(:plan_payment) do
      create(
        :plan_payment,
        user_id: user.id,
        community_id: community.id,
        transaction_id: transaction.id,
        payment_plan_id: payment_plan.id,
        amount: 200,
        manual_receipt_number: '13975',
      )
    end
    let!(:new_transaction) do
      create(
        :transaction,
        user_id: user.id,
        community_id: community.id,
        depositor_id: user.id,
        amount: 300,
      )
    end
    let!(:new_plan_payment) do
      create(
        :plan_payment,
        user_id: user.id,
        community_id: community.id,
        transaction_id: transaction.id,
        payment_plan_id: payment_plan.id,
        amount: 300,
        manual_receipt_number: '13976',
      )
    end
    let!(:other_transaction) do
      create(
        :transaction,
        user_id: user.id,
        community_id: community.id,
        depositor_id: user.id,
        amount: 700,
      )
    end
    let!(:other_plan_payment) do
      create(
        :plan_payment,
        user_id: user.id,
        community_id: community.id,
        transaction_id: transaction.id,
        payment_plan_id: payment_plan.id,
        amount: 700,
        manual_receipt_number: '13977',
      )
    end

    let(:transfer_payment_plan) do
      <<-GQL
        mutation transferPaymentPlan(
          $sourcePlanId: ID!
          $destinationPlanId: ID!
        ) {
          transferPaymentPlan(sourcePlanId: $sourcePlanId, destinationPlanId: $destinationPlanId) {
            paymentPlan {
              id
              landParcel {
                parcelNumber
              }
              planPayments{
                amount
                automatedReceiptNumber
                manualReceiptNumber
                status
                createdAt
              }
            }
          }
        }
      GQL
    end
    describe '#resolve' do
      context 'when source payment plan is not present' do
        it 'raises payment plan not found error' do
          variables = {
            sourcePlanId: '1f7e1787-cd4f-44e5-847f-96f665c4dc5',
            destinationPlanId: other_payment_plan.id,
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

      context 'when destination payment plan is not present' do
        it 'raises payment plan not found error' do
          variables = {
            sourcePlanId: payment_plan.id,
            destinationPlanId: '1f7e1787-cd4f-44e5-847f-96f665c4dc5',
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

      context 'when source payment plan is cancelled' do
        before { payment_plan.cancel! }

        context 'when source plan have only cancelled payments' do
          # rubocop:disable Rails/SkipsModelValidations
          before { payment_plan.plan_payments.update_all(status: :cancelled) }
          # rubocop:enable Rails/SkipsModelValidations
          it 'raises transfer plan cannot be processed error' do
            variables = {
              sourcePlanId: payment_plan.id,
              destinationPlanId: other_payment_plan.id,
            }
            result = DoubleGdpSchema.execute(transfer_payment_plan,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('errors', 0, 'message')).to eql 'The payment plan and all its ' \
                        'payments have already been cancelled, the transfer cannot be processed'
          end
        end

        context 'when source plan have atleast one paid payment' do
          before do
            plan_payment.cancelled!
            new_plan_payment.cancelled!
          end

          it 'transfers the paid payments of souce plan to the destination plan' do
            variables = {
              sourcePlanId: payment_plan.reload.id,
              destinationPlanId: other_payment_plan.id,
            }
            result = DoubleGdpSchema.execute(transfer_payment_plan,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('errors', 0, 'message')).to be_nil
            plan_result = result.dig('data', 'transferPaymentPlan', 'paymentPlan')
            expect(plan_result['planPayments'].size).to eql 1
            expect(plan_result['planPayments'][0]['amount']).to eql 400.0
            expect(plan_result['planPayments'][0]['manualReceiptNumber']).to eql 'MI13977-1'
            expect(
              plan_result['planPayments'][0]['createdAt'].to_date,
            ).to eql other_plan_payment.created_at.to_date
            expect(
              plan_result['planPayments'][0]['automatedReceiptNumber'],
            ).to eql "#{plan_payment.reload.automated_receipt_number}-1"
            expect(payment_plan.reload.pending_balance.to_f).to eql 0.0
            expect(other_payment_plan.reload.pending_balance.to_f).to eql 0.0
            expect(payment_plan.status).to eql 'cancelled'
            general_payments = user.general_payment_plan.plan_payments.reload.order(:amount)
            expect(other_plan_payment.reload.status).to eql 'cancelled'
            expect(general_payments.size).to eql 1
            expect(general_payments[0].amount.to_f).to eql 300.0
            expect(general_payments[0].manual_receipt_number).to eql 'MI13977-2'
            expect(
              general_payments[0].automated_receipt_number,
            ).to eql "#{other_plan_payment.automated_receipt_number}-2"
          end
        end
      end

      context 'when destination payment plan is cancelled' do
        before { other_payment_plan.cancel! }

        it 'raise transfer plan cannot be processed error' do
          variables = {
            sourcePlanId: payment_plan.id,
            destinationPlanId: other_payment_plan.id,
          }
          result = DoubleGdpSchema.execute(transfer_payment_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Transfer of plan cannot be made to '\
            'a cancelled payment plan. Please try transferring to other plans'
        end
      end

      context 'when source payment plan id and destination payment plan id is valid' do
        # rubocop:disable Rails/SkipsModelValidations
        before do
          other_payment_plan.active!
          payment_plan.update(status: :active, pending_balance: 800)
          payment_plan.plan_payments.update_all(status: :paid)
        end
        # rubocop:enable Rails/SkipsModelValidations

        context "when destinaion plan's pending balance is more than the minimum payment amount
                  of soure payment plan" do
          it 'transfers plan payments to new payment plan and allocates the additional payments
              to general plan' do
            expect(payment_plan.pending_balance.to_f).to eql 800.0
            variables = {
              sourcePlanId: payment_plan.id,
              destinationPlanId: other_payment_plan.id,
            }
            result = DoubleGdpSchema.execute(transfer_payment_plan,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('errors', 0, 'message')).to be_nil
            plan_result = result.dig('data', 'transferPaymentPlan', 'paymentPlan')
            expect(plan_result['planPayments'].size).to eql 2
            expect(plan_result['planPayments'][0]['amount']).to eql 200.0
            expect(plan_result['planPayments'][0]['manualReceiptNumber']).to eql 'MI13975'
            expect(
              plan_result['planPayments'][0]['automatedReceiptNumber'],
            ).to eql plan_payment.reload.automated_receipt_number
            expect(plan_result['planPayments'][0]['status']).to eql 'paid'
            expect(plan_result['planPayments'][1]['amount']).to eql 200.0
            expect(plan_result['planPayments'][1]['manualReceiptNumber']).to eql 'MI13976-1'
            expect(plan_result['planPayments'][0]['status']).to eql 'paid'
            expect(
              plan_result['planPayments'][1]['automatedReceiptNumber'],
            ).to eql "#{new_plan_payment.reload.automated_receipt_number}-1"
            expect(payment_plan.reload.pending_balance.to_f).to eql 0.0
            expect(other_payment_plan.reload.pending_balance.to_f).to eql 0.0
            general_payments = user.general_payment_plan.plan_payments.reload.order(:amount)
            expect(plan_payment.status).to eql 'cancelled'
            expect(new_plan_payment.status).to eql 'cancelled'
            expect(other_plan_payment.reload.status).to eql 'cancelled'
            expect(general_payments.size).to eql 2
            expect(general_payments[0].amount.to_f).to eql 100.0
            expect(general_payments[0].manual_receipt_number).to eql 'MI13976-2'
            expect(general_payments[0].status).to eql 'paid'
            expect(
              general_payments[0].automated_receipt_number,
            ).to eql "#{new_plan_payment.automated_receipt_number}-2"
            expect(general_payments[1].amount.to_f).to eql 700.0
            expect(general_payments[1].manual_receipt_number).to eql 'MI13977'
            expect(general_payments[1].status).to eql 'paid'
            expect(
              general_payments[1].automated_receipt_number,
            ).to eql other_plan_payment.reload.automated_receipt_number
          end
        end

        context "when destinaion plan's pending balance is equal to minimum payment amount
                of soure payment plan" do
          before { other_payment_plan.update(pending_balance: 200) }

          it 'uses the full amount of minimum payment and the other payments are allocated to
              the general plan' do
            variables = {
              sourcePlanId: payment_plan.id,
              destinationPlanId: other_payment_plan.id,
            }
            result = DoubleGdpSchema.execute(transfer_payment_plan,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('errors', 0, 'message')).to be_nil
            plan_result = result.dig('data', 'transferPaymentPlan', 'paymentPlan')
            expect(plan_result['planPayments'].size).to eql 1
            expect(plan_result['planPayments'][0]['amount']).to eql 200.0
            expect(plan_result['planPayments'][0]['manualReceiptNumber']).to eql 'MI13975'
            expect(
              plan_result['planPayments'][0]['automatedReceiptNumber'],
            ).to eql plan_payment.reload.automated_receipt_number
            general_payments = user.general_payment_plan.plan_payments.reload.order(:amount)
            expect(general_payments.size).to eql 2
            expect(general_payments[0].amount.to_f).to eql 300.0
            expect(general_payments[0].manual_receipt_number).to eql 'MI13976'
            expect(
              general_payments[0].automated_receipt_number,
            ).to eql new_plan_payment.automated_receipt_number
            expect(general_payments[1].amount.to_f).to eql 700.0
            expect(general_payments[1].manual_receipt_number).to eql 'MI13977'
            expect(
              general_payments[1].automated_receipt_number,
            ).to eql other_plan_payment.automated_receipt_number
          end
        end

        context "when destinaion plan's pending balance is less than minimum payment amount
                of soure payment plan" do
          before { other_payment_plan.update(pending_balance: 100) }

          it 'uses the required amount of minimum payment, the unused amount of minimum payment
              and other payments are allocated to the general plan' do
            variables = {
              sourcePlanId: payment_plan.id,
              destinationPlanId: other_payment_plan.id,
            }
            result = DoubleGdpSchema.execute(transfer_payment_plan,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('errors', 0, 'message')).to be_nil
            plan_result = result.dig('data', 'transferPaymentPlan', 'paymentPlan')
            expect(plan_result['planPayments'].size).to eql 1
            expect(plan_result['planPayments'][0]['amount']).to eql 100.0
            expect(plan_result['planPayments'][0]['manualReceiptNumber']).to eql 'MI13975-1'
            expect(
              plan_result['planPayments'][0]['automatedReceiptNumber'],
            ).to eql "#{plan_payment.reload.automated_receipt_number}-1"
            general_payments = user.general_payment_plan.plan_payments.reload.order(:amount)
            expect(general_payments.size).to eql 3
            expect(general_payments[0].amount.to_f).to eql 100.0
            expect(general_payments[0].manual_receipt_number).to eql 'MI13975-2'
            expect(
              general_payments[0].automated_receipt_number,
            ).to eql "#{plan_payment.automated_receipt_number}-2"
            expect(general_payments[1].amount.to_f).to eql 300.0
            expect(general_payments[1].manual_receipt_number).to eql 'MI13976'
            expect(
              general_payments[1].automated_receipt_number,
            ).to eql new_plan_payment.automated_receipt_number
            expect(general_payments[2].amount.to_f).to eql 700.0
            expect(general_payments[2].manual_receipt_number).to eql 'MI13977'
            expect(
              general_payments[2].automated_receipt_number,
            ).to eql other_plan_payment.automated_receipt_number
          end
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = {
            sourcePlanId: payment_plan.id,
            destinationPlanId: other_payment_plan.id,
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
