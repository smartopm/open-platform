# frozen_string_literal: true

module Types
  # List of payment plan detail fields.
  class PaymentPlanDetailType < Types::BaseObject
    field :payment_plan, Types::PaymentPlanType, null: false
    field :statements, [Types::PlanStatementType], null: false
  end
end
