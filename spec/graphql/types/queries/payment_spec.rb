# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Payment do
  describe 'Payment queries' do
    let!(:user) { create(:admin_user) }
    let!(:community) { user.community }
    let!(:another_user) { create(:user, community: community) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
    end
    let!(:invoice_one) do
      create(:invoice, community_id: community.id, land_parcel: land_parcel,
                       payment_plan: payment_plan, user_id: user.id, status: 'in_progress',
                       created_by: user)
    end
    let!(:payment_one) do
      user.payments.create(amount: 100, payment_type: 'cash',
                           invoice_id: invoice_one.id,
                           community_id: community.id)
    end

    let!(:payment_two) do
      user.payments.create(amount: 200, payment_type: 'cash',
                           invoice_id: invoice_one.id,
                           community_id: community.id)
    end

    let!(:wallet_transaction) do
      user.community.wallet_transactions.create!(user: user, status: 1, amount: 12.0,
                                                 source: 'cash')
    end

    let(:payments_query) do
      <<~GQL
        query {
            payments {
                id
                amount
              }
          }
      GQL
    end

    let(:payment_query) do
      <<~GQL
        query {
            payment(paymentId: "#{payment_one.id}") {
                id
                amount
              }
          }
      GQL
    end

    let(:user_payments_query) do
      <<~GQL
        query {
            userPayments(userId: "#{user.id}") {
                id
                amount
              }
          }
      GQL
    end

    let(:payments_by_txn_id_query) do
      <<~GQL
        query paymentsByTxnId($txnId: ID!) {
            paymentsByTxnId(txnId: $txnId) {
                id
                amount
              }
          }
      GQL
    end

    it 'should retrieve list of payments' do
      result = DoubleGdpSchema.execute(payments_query, context: {
                                         current_user: user,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'payments').length).to eql 2
      expect([payment_one.id, payment_two.id]).to include(result.dig('data', 'payments', 1, 'id'))
    end

    it 'should not retrieve list of payments if user is not admin' do
      result = DoubleGdpSchema.execute(payments_query, context: {
                                         current_user: another_user,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should retrieve payment by id' do
      result = DoubleGdpSchema.execute(payment_query, context: {
                                         current_user: user,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('data', 'payment', 'id')).to eql payment_one.id
      expect(result.dig('data', 'payment', 'amount')).to eql 100.0
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'should raise unauthorized error if current-user is nil' do
      result = DoubleGdpSchema.execute(payment_query, context: {
                                         current_user: nil,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should raise unauthorized error if current-user is not an admin' do
      result = DoubleGdpSchema.execute(payment_query, context: {
                                         current_user: another_user,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should retrieve user payments' do
      result = DoubleGdpSchema.execute(user_payments_query,
                                       variables: { userId: user.id },
                                       context: {
                                         current_user: user,
                                         site_community: community,
                                       }).as_json
      expect(result.dig('data', 'userPayments')).to be_empty
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'should raise an unauthorized error if current-user is nil' do
      result = DoubleGdpSchema.execute(user_payments_query,
                                       variables: { userId: user.id },
                                       context: {
                                         current_user: nil,
                                         site_community: community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should raise an unauthorized error if current-user is not an admin' do
      result = DoubleGdpSchema.execute(user_payments_query,
                                       variables: { userId: user.id },
                                       context: {
                                         current_user: another_user,
                                         site_community: community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    describe '#payments_by_txn_id' do
      before do
        payment_one.payment_invoices.create(
          invoice_id: invoice_one.id, wallet_transaction_id: wallet_transaction.id,
        )
      end

      context 'when current-user is not an admin' do
        it 'should raise unauthorized error' do
          result = DoubleGdpSchema.execute(payments_by_txn_id_query,
                                           variables: { txnId: wallet_transaction.id },
                                           context: {
                                             current_user: another_user,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
        end
      end

      context 'when current-user is an admin' do
        context 'when deposit id is valid' do
          it 'retrieves list of payments by deposit id' do
            result = DoubleGdpSchema.execute(payments_by_txn_id_query,
                                             variables: { txnId: wallet_transaction.id },
                                             context: {
                                               current_user: user,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('data', 'paymentsByTxnId', 0, 'id')).to eql payment_one.id
            expect(result.dig('data', 'paymentsByTxnId', 0, 'amount')).to eql 100.0
            expect(result.dig('errors', 0, 'message')).to be_nil
          end
        end

        context 'when deposit id is invalid' do
          it 'does not return any payments details for deposit id' do
            result = DoubleGdpSchema.execute(payments_by_txn_id_query,
                                             variables: { txnId: 'abcd' },
                                             context: {
                                               current_user: user,
                                               site_community: community,
                                             }).as_json
            expect(result.dig('data', 'paymentsByTxnId')).to be_empty
            expect(result.dig('errors', 0, 'message')).to be_nil
          end
        end
      end
    end
  end
end
