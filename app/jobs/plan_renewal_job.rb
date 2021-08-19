# frozen_string_literal: true

# Execute plan renewal
class PlanRenewalJob < ApplicationJob
  queue_as :default
  VALID_PLAN_TYPES = Payments::SubscriptionPlan.plan_types.keys

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def perform
    Properties::PaymentPlan.where(renewable: true).find_each do |payment_plan|
      next unless payment_plan.plan_duration.last.to_date == 2.months.from_now.to_date
      next unless VALID_PLAN_TYPES.include?(payment_plan.land_parcel.parcel_type&.downcase)

      community = payment_plan.user.community
      sub_plan = community.subscription_plans.status_active.find_by(
        plan_type: payment_plan.land_parcel.parcel_type.downcase,
        start_date: payment_plan.plan_duration.last.to_date,
      )

      if sub_plan.present?
        new_payment_plan = payment_plan.dup
        new_payment_plan.start_date = sub_plan.start_date
        new_payment_plan.installment_amount = sub_plan.amount
        new_payment_plan.total_amount = sub_plan.amount * payment_plan.duration
        new_payment_plan.save!
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
end
