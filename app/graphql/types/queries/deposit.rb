# frozen_string_literal: true

# Transaction queries
module Types::Queries::Deposit
  extend ActiveSupport::Concern

  included do
    field :deposit, Types::WalletTransactionType, null: false do
      description 'return details for one deposit'
      argument :deposit_id, GraphQL::Types::ID, required: true
    end
  end

  def deposit(deposit_id:)
    return ::WalletTransaction.find(deposit_id) if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Unauthorized'
  end
end
