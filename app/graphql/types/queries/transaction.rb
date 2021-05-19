# frozen_string_literal: true

# Transaction queries
module Types::Queries::Transaction
  extend ActiveSupport::Concern
  included do
    # Get user's transactions
    field :user_transactions, [Types::TransactionType], null: true do
      description 'Get all all user transactions'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Returns list of user's all transactions
    #
    # @param user_id [String]
    # @param offset [Integer]
    # @param limit [Integer]
    #
    # @return [Array<TransactionType>]
    def user_transactions(user_id: nil, offset: 0, limit: 10)
      user = verified_user(user_id)

      user.transactions.not_cancelled.includes(:plan_payments,
                                               :depositor).limit(limit).offset(offset)
    end

    # Verifies user
    #
    # @param user_id [String]
    #
    # @return [User] if user is valid
    # @return [GraphQL::ExecutionError]
    def verified_user(user_id)
      unless context[:current_user]&.id == user_id || context[:current_user]&.admin?
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      user = User.allowed_users(context[:current_user]).find_by(id: user_id)
      return user if user.present?

      raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
    end
  end
end
