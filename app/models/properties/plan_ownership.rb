# frozen_string_literal: true

module Properties
  # PlanOwnership
  class PlanOwnership < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :payment_plan, class_name: 'Properties::PaymentPlan'
  end
end
