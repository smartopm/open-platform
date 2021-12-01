# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Deposit do
  describe 'Deposit queries' do
    let!(:user) { create(:admin_user) }
    let!(:another_user) { create(:user, community: user.community) }
    let!(:wallet_transaction) do
      create(:wallet_transaction, user: user, community: user.community)
    end

    let(:deposit_query) do
      <<~GQL
        query depositQuery (
          $depositId: ID!
        ) {
          deposit(depositId: $depositId) {
              id
            }
          }
      GQL
    end

    let(:user_deposits) do
      <<~GQL
        query userTransactions (
          $userId: ID!
        ) {
          userDeposits(userId: $userId) {
            transactions {
                id
              }
            pendingInvoices {
                id
              }
            }
          }
      GQL
    end

    it 'gets a deposit' do
      variables = {
        depositId: wallet_transaction.id,
      }
      result = DoubleGdpSchema.execute(deposit_query, variables: variables, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('data', 'deposit', 'id')).to eql wallet_transaction.id
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'raises unauthorized error if current_user is not present' do
      variables = {
        depositId: wallet_transaction.id,
      }
      result = DoubleGdpSchema.execute(deposit_query, variables: variables, context: {
                                         current_user: nil,
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'raises unauthorized error if current_user is not an admin' do
      variables = {
        depositId: wallet_transaction.id,
      }
      result = DoubleGdpSchema.execute(deposit_query, variables: variables, context: {
                                         current_user: another_user,
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'retrieves user transactions' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(user_deposits, variables: variables, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json

      expect(
        result.dig('data', 'userDeposits', 'transactions', 0, 'id'),
      ).to eql wallet_transaction.id
      expect(result.dig('data', 'userDeposits', 'pendingInvoices')).to be_empty
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'raises unauthorized error if current_user is not present' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(user_deposits, variables: variables, context: {
                                         current_user: nil,
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'raises unauthorized error if current_user is not an admin' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(user_deposits, variables: variables, context: {
                                         current_user: another_user,
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
