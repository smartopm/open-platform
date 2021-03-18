# frozen_string_literal: true

# wallet queries
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

    field :payment_stat_details, [Types::WalletTransactionType], null: true do
      description 'Get list of all transactions in a particular day'
      argument :query, String, required: false
    end

    field :payment_accounting_stats, [Types::PaymentAccountingStatType], null: false do
      description 'return stats of all unpaid invoices'
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
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    puts '######################'
    puts query
    puts '######################'
    context[:site_community].wallet_transactions.search(query).eager_load(:user)
                            .order(created_at: :desc)
                            .limit(limit).offset(offset)
  end

  def payment_accounting_stats
    WalletTransaction.payment_stat(context[:site_community])
  end

  def payment_stat_details(query:)
    converted_date = Date.parse(query).in_time_zone(context[:site_community].timezone).all_day
    context[:site_community].wallet_transactions
                            .eager_load(:user)
                            .where(created_at: converted_date, destination: 'wallet')
  end

  def transaction_receipt(transaction_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    # rubocop:disable Lint/SafeNavigationChain
    context[:site_community].wallet_transactions.find(transaction_id)&.payment_invoice.payment
    # rubocop:enable Lint/SafeNavigationChain
  end

  # It would be good to put this elsewhere to use it in other queries
  def verified_user(user_id)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.id == user_id ||
                                                         context[:current_user]&.admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user
  end
end
