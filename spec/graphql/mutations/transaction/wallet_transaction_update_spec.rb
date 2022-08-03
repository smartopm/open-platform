# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionUpdate do
  describe 'update a transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_records',
                          role: admin_role,
                          permissions: %w[can_update_wallet_transaction])
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
    let!(:user_wallet) { create(:wallet, user: user, balance: 0) }
    let!(:wallet_transaction) do
      user.community.wallet_transactions.create!(user: user, status: 1, amount: 12.0,
                                                 source: 'cash')
    end

    let(:update_mutation) do
      <<~GQL
        mutation updateTransaction(
          $id: ID!
          $source: String!
          $transactionNumber: String
        ) {
          walletTransactionUpdate(
            id: $id
            source: $source
            transactionNumber: $transactionNumber
          ) {
            walletTransaction {
              id
              transactionNumber
            }
          }
        }
      GQL
    end

    it 'updates a wallet transaction and adds amount to balance' do
      variables = {
        id: wallet_transaction.id,
        transactionNumber: '100',
        source: 'cash',
      }

      result = DoubleGdpSchema.execute(update_mutation, variables: variables,
                                                        context: {
                                                          current_user: admin,
                                                          site_community: user.community,
                                                        }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'walletTransactionUpdate', 'walletTransaction',
                        'id')).not_to be_nil
      expect(result.dig('data', 'walletTransactionUpdate', 'walletTransaction',
                        'transactionNumber')).to eql '100'
    end
  end
end
