# frozen_string_literal: true

module Types
  # SubscriptionPlanType
  class SubscriptionPlanType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: false
    field :plan_type, String, null: false
    field :amount, String, null: false
    field :start_date, GraphQL::Types::ISO8601DateTime, null: false
    field :end_date, GraphQL::Types::ISO8601DateTime, null: false
  end
end
