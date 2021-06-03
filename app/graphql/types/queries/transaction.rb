# frozen_string_literal: true

# Transaction queries
module Types::Queries::Transaction
  extend ActiveSupport::Concern

  included do
    # Get user's transactions
    field :user_transactions, [Types::TransactionType], null: true do
      description 'Get all user transactions'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :transaction_receipt, Types::TransactionReceiptType, null: true do
      description 'Fetches transaction receipt details'
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get transactions list
    field :transactions_list, [Types::TransactionType], null: true do
      description 'Get list of all transactions'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end
  end

  # Returns list of user's all transactions
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<TransactionType>]
  def user_transactions(limit: nil, user_id: nil, offset: 0)
    user = verified_user(user_id)

    user.transactions.not_cancelled.includes(:plan_payments,
                                             :depositor).order(created_at:
                                            :desc).limit(limit).offset(offset)
  end

  # Deposit's receipt details.
  #
  # @param id [String]
  #
  # @return [Transaction]
  def transaction_receipt(id:)
    transaction = context[:site_community].transactions.find_by(id: id)
    raise_deposit_not_found_error(transaction)

    transaction
  end

  def transactions_list(offset: 0, limit: 100, query: nil)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].transactions.search(query)
                            .eager_load(:user)
                            .order(created_at: :desc)
                            .limit(limit).offset(offset)
  end

  private

  # Raises GraphQL execution error if transaction does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_deposit_not_found_error(transaction)
    return if transaction

    raise GraphQL::ExecutionError, I18n.t('errors.transaction.not_found')
  end
end
