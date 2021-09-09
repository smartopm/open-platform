# frozen_string_literal: true

# Execute plan renewal
class PlanRenewalJob < ApplicationJob
  queue_as :default
  VALID_PLAN_TYPES = Payments::SubscriptionPlan.plan_types

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  # rubocop:disable Style/OptionalBooleanParameter
  def perform(dry_run = true)
    Properties::PaymentPlan.not_cancelled.where(
      renewable: true, plan_type: VALID_PLAN_TYPES.keys, renewed_plan_id: nil,
    ).find_each do |payment_plan|
      unless payment_plan.within_renewable_dates?
        Rails.logger.info "Payment-plan #{payment_plan.id} does not fall within renewable date"
        next
      end

      community = payment_plan.user.community
      next_plan_start_date = payment_plan.next_plan_start_date

      if Properties::PaymentPlan.find_by(
        user_id: payment_plan.user.id,
        renewable: true,
        plan_type: payment_plan.plan_type,
        start_date: next_plan_start_date,
      ).present?
        Rails.logger.info "Payment-plan #{payment_plan.id} has already been renewed for this period"
        next
      end

      sub_plan = community.subscription_plans.status_active.find_by(
        'plan_type = ? AND start_date <= ? AND end_date > ?',
        VALID_PLAN_TYPES[payment_plan.plan_type],
        next_plan_start_date,
        next_plan_start_date,
      )

      if sub_plan.present?
        Rails.logger.info "Found a subscription-plan: #{sub_plan.id} to "\
        "renew payment-plan: #{payment_plan.inspect}"

        unless dry_run
          new_payment_plan = payment_plan.dup
          new_payment_plan.start_date = next_plan_start_date
          new_payment_plan.plan_type = sub_plan.plan_type
          new_payment_plan.installment_amount = sub_plan.amount
          new_payment_plan.total_amount = sub_plan.amount * payment_plan.duration
          new_payment_plan.save!
          payment_plan.update!(renewed_plan_id: new_payment_plan.id)
        end
      else
        Rails.logger.info "No active subscription-plan found for payment-plan: #{payment_plan.id}"
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/BlockLength
  # rubocop:enable Style/OptionalBooleanParameter
end
