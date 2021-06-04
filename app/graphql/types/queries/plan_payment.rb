# frozen_string_literal: true

# PlanPayment queries
module Types::Queries::PlanPayment
  extend ActiveSupport::Concern

  included do
    field :payment_receipt, Types::PlanPaymentType, null: true do
      description 'Fetches payment receipt details'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  # Payment's receipt details.
  #
  # @param id [String]
  #
  # @return [PlanPayment]
  def payment_receipt(id:)
    payment = context[:site_community].plan_payments.find_by(id: id)
    raise_payment_not_found_error(payment)

    payment
  end

  private

  # Raises GraphQL execution error if payment does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_payment_not_found_error(payment)
    return if payment

    raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
  end
end
