# frozen_string_literal: true

# wallet queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::Wallet
  extend ActiveSupport::Concern
  # rubocop:disable Metrics/BlockLength
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
    field :transactions, [Types::WalletTransactionType], null: true do
      description 'Get list of all transactions'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    # Get transaction's receipt
    field :transaction_receipt, Types::PaymentType, null: true do
      description 'Get a receipt for a transaction'
      argument :transaction_id, GraphQL::Types::ID, required: true
    end
  end
  # rubocop:enable Metrics/BlockLength

  def user_wallets(user_id: nil, offset: 0, limit: 100)
    user = verified_user(user_id)

    user.wallets.order(created_at: :desc).limit(limit).offset(offset)
  end

  def user_wallet_transactions(user_id: nil, offset: 0, limit: 100)
    user = verified_user(user_id)
    user.wallet_transactions.order(created_at: :desc).limit(limit).offset(offset)
  end

  def transactions(offset: 0, limit: 100, query: nil)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].wallet_transactions.where(destination: 'wallet').search(query)
                            .eager_load(:user)
                            .order(created_at: :desc)
                            .limit(limit).offset(offset)
  end

  def transaction_receipt(transaction_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    # rubocop:disable Lint/SafeNavigationChain
    context[:site_community].wallet_transactions.find(transaction_id)&.payment_invoice.payment
    # rubocop:enable Lint/SafeNavigationChain
  end
  # rubocop:enable Metrics/ModuleLength
end
