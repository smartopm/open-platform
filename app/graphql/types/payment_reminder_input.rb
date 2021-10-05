# frozen_string_literal: true

module Types
  # PaymentReminderInput
  class PaymentReminderInput < Types::BaseInputObject
    argument :user_id, ID, required: true
    argument :payment_plan_id, ID, required: true
  end
end
