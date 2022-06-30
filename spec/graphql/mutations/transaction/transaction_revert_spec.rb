# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionRevert do
  describe 'revert a transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_records',
                          role: admin_role,
                          permissions: %w[can_revert_transaction])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            pending_balance: 1200, installment_amount: 100,
                            duration: 12)
    end
    let(:other_payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            installment_amount: 200,
                            duration: 8, status: 'completed')
    end
    let!(:other_transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1600)
    end
    let!(:other_plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: other_transaction.id,
                            payment_plan_id: other_payment_plan.id, amount: 1600)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1500)
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 1000)
    end
    let!(:general_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, amount: 500,
                            payment_plan: user.general_payment_plan)
    end
    let(:transaction_revert_mutation) do
      <<~GQL
        mutation TransactionRevert($id: ID!) {
          transactionRevert(id: $id) {
            transaction {
              id
              status
              amount
              planPayments {
                status
              }
            }
          }
        }
      GQL
    end

    describe '#authorized?' do
      context 'when current user is not admin' do
        it 'raises unauthorized error' do
          variables = { id: transaction.id }
          result = DoubleGdpSchema.execute(transaction_revert_mutation,
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
      context 'when transaction id is valid' do
        before { payment_plan.update(pending_balance: 1000) }

        it 'cancels transaction, payments and update plan pending balance' do
          variables = { id: transaction.id }
          result = DoubleGdpSchema.execute(transaction_revert_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          transaction_details = result.dig('data', 'transactionRevert', 'transaction')
          expect(transaction_details['status']).to eql 'cancelled'
          expect(transaction_details['amount']).to eql 1500.0
          expect(transaction_details['planPayments'][0]['status']).to eql('cancelled')
          expect(payment_plan.reload.pending_balance).to eql 2000.0
          expect(general_payment.reload.status).to eql 'cancelled'
        end
      end

      context 'when a transaction is reverted for a payment plan with pending balance 0' do
        before { other_payment_plan.update(pending_balance: 0) }
        it 'cancels transaction, payments, updates plan pending balance and status' do
          variables = { id: other_transaction.id }
          result = DoubleGdpSchema.execute(transaction_revert_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          transaction_details = result.dig('data', 'transactionRevert', 'transaction')
          expect(transaction_details['status']).to eql 'cancelled'
          expect(transaction_details['amount']).to eql 1600.0
          expect(transaction_details['planPayments'][0]['status']).to eql('cancelled')
          expect(other_payment_plan.reload.pending_balance).to eql 1600.0
          expect(other_payment_plan.status).to eql 'active'
        end
      end

      context 'when transaction id is invalid' do
        it 'raises transaction not found error' do
          variables = { id: '1234' }
          result = DoubleGdpSchema.execute(transaction_revert_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Transaction not found'
        end
      end
    end
  end
end
