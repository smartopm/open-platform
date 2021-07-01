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

    field :payment_accounting_stats, [Types::PaymentAccountingStatType], null: false do
      description 'return stats of all transactions'
    end

    field :transaction_summary, Types::PaymentSummaryType, null: false do
      description 'return stats payment amount'
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

  def payment_accounting_stats
    Payments::Transaction.payment_stat(context[:site_community])
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def transaction_summary
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    transactions = context[:site_community].transactions.not_cancelled
    {
      today: transactions
        .where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
        .sum(&:amount),
      one_week: transactions
        .where('created_at >= ? AND created_at <= ?', 1.week.ago, Time.zone.now.end_of_day)
        .sum(&:amount),
      one_month: transactions
        .where('created_at >= ? AND created_at <= ?', 30.days.ago, Time.zone.now.end_of_day)
        .sum(&:amount),
      over_one_month: transactions
        .where('created_at >= ? AND created_at <= ?', 1.year.ago, Time.zone.now.end_of_day)
        .sum(&:amount),
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  # Raises GraphQL execution error if transaction does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_deposit_not_found_error(transaction)
    return if transaction

    raise GraphQL::ExecutionError, I18n.t('errors.transaction.not_found')
  end
end
