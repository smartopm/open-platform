# frozen_string_literal: true

# Payment queries
module Types::Queries::Payment
  extend ActiveSupport::Concern

  included do
    field :payment, Types::PaymentType, null: false do
      description 'return details for one payment'
      argument :payment_id, GraphQL::Types::ID, required: true
    end
  end

  def payment(payment_id:)
    return ::Payment.find(payment_id) if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Unauthorized'
  end
end
