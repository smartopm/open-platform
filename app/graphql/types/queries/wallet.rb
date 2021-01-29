# frozen_string_literal: true

# wallet queries
module Types::Queries::Wallet
  extend ActiveSupport::Concern

  included do
    # Get wallets
    field :user_wallets, [Types::WalletType], null: true do
      description 'Get all wallets'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get wallets transactions
    field :user_wallet_transactions, [Types::WalletTransactionType], null: true do
      description 'Get all wallets transactions'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get wallets transactions
    field :transaction_invoice, Types::InvoiceType, null: true do
      description 'Get all an invoice using a transaction'
      argument :transaction_id, GraphQL::Types::ID, required: true
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def user_wallets(user_id: nil, offset: 0, limit: 100)
    user = verified_user(user_id)

    user.wallets.order(created_at: :desc).limit(limit).offset(offset)
  end

  def user_wallet_transactions(user_id: nil, offset: 0, limit: 100)
    user = verified_user(user_id)
    user.wallet_transactions.order(created_at: :desc).limit(limit).offset(offset)
  end

  def transaction_invoice(transaction_id:, user_id:)
    user = verified_user(user_id)
    user.wallet_transactions.find(transaction_id).payment_invoice.invoice
  end

  # It would be good to put this elsewhere to use it in other queries
  # rubocop:disable Metrics/AbcSize
  def verified_user(user_id)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].id == user_id ||
                                                         context[:current_user].admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user
  end
  # rubocop:enable Metrics/AbcSize
end
