# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionCreate do
  describe 'WalletTransactionCreate' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation walletTransactionCreate($userId: ID!, $amount: Float!, $source: String!, $bankName: String, $chequeNumber: String, $status: String) {
          walletTransactionCreate(userId: $userId, amount: $amount, source: $source, bankName: $bankName, chequeNumber: $chequeNumber, status: $status){
            walletTransaction {
              id
            }
          }
        }
      GQL
    end

    it 'creates a wallet-transaction' do
      variables = {
        userId: user.id,
        amount: (rand * 100).to_f,
        source: 'cash',
        status: 'in_progress',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id')).not_to be_nil
      expect(result['errors']).to be_nil
    end
  end
end
