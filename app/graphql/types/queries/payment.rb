# frozen_string_literal: true

# Payment queries
module Types::Queries::Payment
  extend ActiveSupport::Concern

  included do
    field :payment, Types::PaymentType, null: false do
      description 'return details for one payment'
      argument :payment_id, GraphQL::Types::ID, required: true
    end
    field :payments, [Types::PaymentType], null: false do
      description 'return list of all payments'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def payment(payment_id:)
    return ::Payment.find(payment_id) if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Unauthorized'
  end

  def payments(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?
    
    return ::Payment.eager_load(:invoices).limit(limit).offset(offset) 
    
  end
end
