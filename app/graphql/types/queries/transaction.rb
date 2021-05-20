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
                                               :depositor).order(created_at:
                                              :desc).limit(limit).offset(offset)
    end
  end
end
