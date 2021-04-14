# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionRevert do
  describe 'revert a transaction' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:user_wallet) { create(:wallet, user: user, balance: 100) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 100)
    end
    let!(:txn) do
      create(:wallet_transaction, amount: 100, destination: 'wallet',
                                  user: user, community_id: user.community_id,
                                  payment_plan_id: payment_plan.id)
    end

    let(:mutation) do
      <<~GQL
        mutation walletTransactionRevert (
          $id: ID!,  
        ) {
          walletTransactionRevert(
            id: $id,
          ){
            walletTransaction {
              status
            }
          }
        }
      GQL
    end

    let(:invoice) do
      create(:invoice, community_id: user.community_id,
                       land_parcel_id: land_parcel.id,
                       user_id: user.id, status: 'in_progress',
                       amount: 50)
    end

    it 'reverts a wallet transaction and associated payments' do
      variables = { id: txn.id }
      expect(user.wallet.balance).to eql 100.0
      expect(user.payments.count).to eql 0
      expect(user.wallet_transactions.count).to eql 1
      invoice
      expect(user.wallet.balance).to eql 50.0
      expect(user.payments.count).to eql 1
      expect(user.wallet_transactions.count).to eql 2
      expect(user.wallet_transactions.pluck(:status).uniq).to eql ['settled']
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(
        result.dig('data', 'walletTransactionRevert', 'walletTransaction', 'status'),
      ).to eql 'cancelled'
      expect(user.wallet.balance).to eql 0.0
      expect(user.wallet.pending_balance).to eql invoice.amount
      expect(user.payments.last.payment_status).to eql 'cancelled'
      expect(user.wallet_transactions.pluck(:status).uniq).to eql ['cancelled']
      expect(result['errors']).to be_nil
    end
  end
end