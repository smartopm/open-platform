# frozen_string_literal: true

# Subscription plans queries
module Types::Queries::SubscriptionPlan
  extend ActiveSupport::Concern

  included do
    field :subscription_plans, [Types::SubscriptionPlanType], null: false do
      description 'return all subscription plans'
    end
  end

  def subscription_plans
    unless context[:current_user].admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].subscription_plans
  end
end
