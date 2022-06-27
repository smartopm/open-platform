# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionRevert do
  describe 'revert a transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_records',
                          role: admin_role,
                          permissions: %w[can_revert_wallet_transaction])
    end
    let!(:user) do
      create(:user_with_community, user_type: 'resident',
                                   role: resident_role)
    end
    let(:community) { user.community }
    let!(:admin) do
      create(:admin_user, community_id: community.id, user_type: 'admin',
                          role: admin_role)
    end
    let!(:user_wallet) { create(:wallet, user: user, balance: 100) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 100)
    end
    let!(:invoice) do
      create(:invoice, community_id: user.community_id,
                       land_parcel_id: land_parcel.id,
                       payment_plan_id: payment_plan.id,
                       user_id: user.id, status: 'in_progress',
                       amount: 50)
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

    it 'reverts a wallet transaction and associated payments' do
      user_wallet.settle_invoices(transaction: txn)
      variables = { id: txn.id }
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
      expect(user.wallet.reload.balance).to eql 0.0
      expect(user.wallet.pending_balance).to eql 100
      expect(user.payments.last.payment_status).to eql 'cancelled'
      expect(user.wallet_transactions.pluck(:status).uniq).to eql ['cancelled']
      expect(result['errors']).to be_nil
    end
  end
end
