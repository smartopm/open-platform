# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionCreate do
  describe 'create for transaction' do
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:user) { create(:user_with_community) }
    let!(:user_wallet) { create(:wallet, user: user, balance: 0) }

    let(:mutation) do
      <<~GQL
        mutation walletTransactionCreate (
          $userId: ID!,
          $amount: Float!,
          $source: String!
        ) {
          walletTransactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source
          ){
            walletTransaction {
              id
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
      }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id')).not_to be_nil
      expect(user.wallet.balance).to eql 100.0
      expect(result['errors']).to be_nil
    end
  end
end
