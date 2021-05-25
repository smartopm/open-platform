# frozen_string_literal: true

# balance queries
module Types::Queries::Balance
  extend ActiveSupport::Concern

  included do
    # Get user's balance
    field :user_balance, Types::BalanceType, null: true do
      description 'Get user balance by user id'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  # User's available balance and pending balance
  # * Available balance.
  # * Pending amount to be paid by user.
  #
  # @param user_id [String] User#id
  #
  # @return [Hash]
  def user_balance(user_id:)
    raise_unauthorized_user_error(user_id)

    user = context[:site_community].users.find_by(id: user_id)
    raise_user_not_found_error(user)

    transaction_amount = user.transactions.not_cancelled.sum(:amount)
    payments_amount = user.plan_payments.not_cancelled.sum(:amount)
    {
      balance: transaction_amount - payments_amount,
      pending_balance: user.payment_plans.sum(:pending_balance),
    }
  end

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_user_error(user_id)
    return if context[:current_user]&.admin? || user_id.eql?(context[:current_user]&.id)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  # Raises GraphQL execution error if user does not exists.
  #
  # @return [GraphQL::ExecutionError]
  def raise_user_not_found_error(user)
    return if user

    raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
  end
end
