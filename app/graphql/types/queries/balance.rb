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
  # * Total transactions made by the user
  #
  # @param user_id [String] User#id
  #
  # @return [Hash]
  def user_balance(user_id:)
    raise_unauthorized_user_error(user_id)

    user = context[:site_community].users.find_by(id: user_id)
    raise_user_not_found_error(user)

    {
      balance: general_fund_balance(user),
      pending_balance: user.payment_plans.excluding_general_plans.sum(:pending_balance),
      total_transactions: user.transactions.accepted.sum(:amount),
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

  # Returns sum of general funds
  # * If general fund is not present returns 0
  #
  # @return [Float]
  def general_fund_balance(user)
    return 0 if user.payment_plans.general.blank?

    user.general_payment_plan.plan_payments.paid.sum(:amount)
  end
end
