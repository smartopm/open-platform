# frozen_string_literal: true

# Execute plan renewal
class PlanRenewalJob < ApplicationJob
  queue_as :default
  VALID_PLAN_TYPES = Payments::SubscriptionPlan.plan_types

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  def perform
    Properties::PaymentPlan.where(renewable: true).find_each do |payment_plan|
      next unless payment_plan.plan_duration.last.to_date == 2.months.from_now.to_date
      next unless VALID_PLAN_TYPES.keys.include?(payment_plan.plan_type)

      community = payment_plan.user.community
      next_plan_start_date = payment_plan.plan_duration.last.to_date

      if Properties::PaymentPlan.find_by(
        user_id: payment_plan.user.id,
        renewable: true,
        plan_type: payment_plan.plan_type,
        start_date: next_plan_start_date,
      ).present?
        next
      end

      sub_plan = community.subscription_plans.status_active.find_by(
        'plan_type = ? AND start_date <= ? AND end_date > ?',
        VALID_PLAN_TYPES[payment_plan.plan_type],
        next_plan_start_date,
        next_plan_start_date,
      )

      if sub_plan.present?
        new_payment_plan = payment_plan.dup
        new_payment_plan.start_date = next_plan_start_date
        new_payment_plan.plan_type = sub_plan.plan_type
        new_payment_plan.installment_amount = sub_plan.amount
        new_payment_plan.total_amount = sub_plan.amount * payment_plan.duration
        new_payment_plan.save!
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/BlockLength
end
