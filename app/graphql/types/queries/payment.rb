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
  end

  def payment(payment_id:)
    return ::Payment.find(payment_id) if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Unauthorized'
  end

  def user_payments(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?
    
    ::PaymentInvoice.where(invoice_id: user.invoices.pluck(:id))&.map(&:payment)
  end
end
