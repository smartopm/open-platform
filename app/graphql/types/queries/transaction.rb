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

    field :payment_accounting_stats, [Types::PaymentAccountingStatType], null: false do
      description 'return stats of all transactions'
    end

    field :payment_stat_details, [Types::PlanPaymentType], null: true do
      description 'Get list of all transactions in a particular day'
      argument :query, String, required: false
    end

    field :payment_summary, Types::PaymentSummaryType, null: false do
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

  def payment_accounting_stats
    Transaction.payment_stat(context[:site_community])
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def payment_stat_details(query:)
    payments = context[:site_community].plan_payments
                                       .not_cancelled
                                       .eager_load(:user)
    case query
    when 'today'
      payments.where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
    when 'oneWeek'
      payments.where(created_at: 1.week.ago..Time.zone.now.end_of_day)
    when 'oneMonth'
      payments.where(created_at: 30.days.ago..Time.zone.now.end_of_day)
    when 'overOneMonth'
      payments.where(created_at: 1.year.ago..Time.zone.now.end_of_day)
    else
      converted_date = Date.parse(query).in_time_zone(context[:site_community].timezone).all_day
      payments.where(created_at: converted_date)
    end
  end

  def payment_summary
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    payments = context[:site_community].transactions.not_cancelled
    {
      today: payments
        .where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
        .sum(&:amount),
      one_week: payments
        .where('created_at >= ? AND created_at <= ?', 1.week.ago, Time.zone.now.end_of_day)
        .sum(&:amount),
      one_month: payments
        .where('created_at >= ? AND created_at <= ?', 30.days.ago, Time.zone.now.end_of_day)
        .sum(&:amount),
      over_one_month: payments
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
