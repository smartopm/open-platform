# frozen_string_literal: true

# Subscription plans queries
module Types::Queries::SubscriptionPlan
  extend ActiveSupport::Concern

  included do
    field :subscription_plans, [Types::SubscriptionPlanType], null: true do
      description 'return all subscription plans'
    end
  end

  def subscription_plans
    unless permitted?(
      module: :subscription_plan,
      permission: :can_fetch_subscription_plans,
    )
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].subscription_plans
  end
end
