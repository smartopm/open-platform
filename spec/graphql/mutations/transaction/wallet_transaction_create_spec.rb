# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionCreate do
  describe 'create for transaction' do
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:user) { create(:user_with_community) }
    let!(:user_wallet) { create(:wallet, user: user, balance: 0) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:payment_plan) do
      create(:payment_plan,
             land_parcel_id: land_parcel.id,
             user_id: user.id,
             plot_balance: 100,
             pending_balance: 5000)
    end

    let(:mutation) do
      <<~GQL
        mutation walletTransactionCreate (
          $userId: ID!,
          $amount: Float!,
          $source: String!,
          $landParcelId: ID!
        ) {
          walletTransactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source,
            landParcelId: $landParcelId
          ){
            walletTransaction {
              id
              settledInvoices
              currentPlanBalance
            }
          }
        }
      GQL
    end

    it 'creates a wallet transaction and adds amount to balance' do
      variables = {
        userId: user.id,
        amount: 100,
        source: 'cash',
        landParcelId: land_parcel.id,
      }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      puts result
      expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id')).not_to be_nil
      expect(result.dig(
               'data', 'walletTransactionCreate', 'walletTransaction', 'settledInvoices'
             )).to_not be_nil
      expect(result.dig(
               'data', 'walletTransactionCreate', 'walletTransaction', 'currentPlanBalance'
             )).to eql(4900.0)
      expect(user.wallet.balance).to eql 100.0
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        userId: user.id,
        amount: 100,
        source: 'cash',
        landParcelId: land_parcel.id,
      }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
