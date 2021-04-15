# frozen_string_literal: true

# Payment queries
module Types::Queries::Payment
  extend ActiveSupport::Concern

  included do
    field :payment, Types::PaymentType, null: false do
      description 'return details for one payment'
      argument :payment_id, GraphQL::Types::ID, required: true
    end

    field :user_payments, [Types::PaymentType], null: false do
      description 'return payment records for user invoices'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    field :payments, [Types::PaymentType], null: false do
      description 'return list of all payments'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    field :payments_by_txn_id, [Types::PaymentType], null: false do
      description 'return list of all payments by deposit id'
      argument :txn_id, GraphQL::Types::ID, required: true
    end
  end

  def payment(payment_id:)
    return context[:site_community].payments.find(payment_id) if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Unauthorized'
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  def user_payments(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    ::PaymentInvoice.where(invoice_id: user.invoices.eager_load(:payments)
                                           .pluck(:id))&.map(&:payment)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity

  def payments(query: nil, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].payments.search(query).eager_load(:invoices, :user)
                            .limit(limit).offset(offset)
  end

  # Query to fetch payments by deposit id.
  #
  # @param txn_id [String] WalletTransaction#id
  #
  # @return [Hash]
  def payments_by_txn_id(txn_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    ::PaymentInvoice.where(wallet_transaction_id: txn_id)&.map(&:payment)
  end
end
