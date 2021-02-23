# frozen_string_literal: true

# Transaction queries
module Types::Queries::Deposit
  extend ActiveSupport::Concern

  included do
    field :deposit, Types::WalletTransactionType, null: false do
      description 'return details for one deposit'
      argument :deposit_id, GraphQL::Types::ID, required: true
    end

    field :user_deposits, Types::DepositType, null: false do
      description 'return deposits for a user'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    field :deposits_by_depositor_id, Types::DepositType, null: false do
      description 'return deposits for a depositor'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def deposit(deposit_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].wallet_transactions.find(deposit_id)
  end

  # rubocop:disable Metrics/AbcSize
  def user_deposits(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    pending_invoices = cumulate_pending_balance(user.invoices.where('pending_amount > ?', 0))
    {
      transactions: user.wallet_transactions.reverse,
      pending_invoices: pending_invoices,
    }
  end

  # rubocop:disable Metrics/MethodLength
  def deposits_by_depositor_id(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    pending_invoices = cumulate_pending_balance(user.invoices.where('pending_amount > ?', 0))
    transactions = context[:site_community].wallet_transactions
                                           .where(depositor_id: user_id).reverse
    {
      transactions: transactions,
      pending_invoices: pending_invoices,
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def cumulate_pending_balance(invoices)
    balance = 0
    pending_invoices = []
    invoices.reverse.each do |invoice|
      invoice_data = invoice.attributes
      balance += invoice.pending_amount
      invoice_data['balance'] = balance
      pending_invoices.push(invoice_data)
    end
    pending_invoices
  end
end
