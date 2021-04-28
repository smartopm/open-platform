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
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = context[:site_community].users.find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user.wallet
  end
end
