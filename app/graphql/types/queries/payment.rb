# frozen_string_literal: true

# payment queries
module Types::Queries::Payment
  extend ActiveSupport::Concern

  included do
    # Get payments
    field :payments, [Types::PaymentType], null: true do
      description 'Get all payments'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
    # Get single payment by id
    field :payment, Types::PaymentType, null: true do
      description 'Get single payment by its id'
      argument :payment_id, GraphQL::Types::ID, required: true
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def payments(user_id:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user.payments.limit(limit).offset(offset)
  end

  def payment(user_id:, payment_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user.payments.find(payment_id)
  end
end
