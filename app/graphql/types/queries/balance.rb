# frozen_string_literal: true

# balance queries
module Types::Queries::Balance
  extend ActiveSupport::Concern

  included do
    # Get user balance
    field :user_balance, Types::BalanceType, null: true do
      description 'Get user balance by user id'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  # Returns user's wallet balance
  # * Available balance.
  # * Pending amount to be paid by user.
  #
  # @param user_id [String] User#id
  #
  # @return [Wallet]
  def user_balance(user_id:)
    raise_unauthorized_error(user_id)

    user = context[:site_community].users.find(user_id)
    return user.wallet if user.present?

    raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
  end

  def raise_unauthorized_error(user_id)
    return if context[:current_user]&.admin? || user_id.eql?(context[:current_user]&.id)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end
end
