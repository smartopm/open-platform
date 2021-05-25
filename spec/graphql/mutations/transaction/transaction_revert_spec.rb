# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::TransactionRevert do
  describe 'revert a transaction' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community.id) }
    let(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            pending_balance: 1200, monthly_amount: 100,
                            duration_in_month: 12)
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

        it 'cancels transaction, payments and update plot pending balance' do
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
