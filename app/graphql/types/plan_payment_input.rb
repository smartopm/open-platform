# frozen_string_literal: true

module Types
  # PlanPaymentInput
  class PlanPaymentInput < Types::BaseInputObject
    argument :payment_plan_id, ID, required: true
    argument :amount, Float, required: true
    argument :receipt_number, String, required: false
  end
end
