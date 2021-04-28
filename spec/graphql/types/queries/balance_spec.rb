# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Balance do
  describe 'showroom queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:user_wallet) { create(:wallet, user: current_user, balance: 100, pending_balance: 10) }
    let(:user_balance) do
      <<~GQL
        query {
          userBalance(userId: "#{current_user.id}") {
            balance
            pendingBalance
          }
        }
      GQL
    end

    it 'should retrieve balance of user' do
      result = DoubleGdpSchema.execute(user_balance,
                                       context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userBalance', 'balance')).to eql 100.0
      expect(result.dig('data', 'userBalance', 'pendingBalance')).to eql(- 10.0)
    end
  end
end
