# frozen_string_literal: true

# Defines the mutation to update payment day.
module Mutations
  module PaymentPlan
    # Updates Payment Day (PaymentPlan#payment_day) for a Land Parcel.
    class PaymentDayUpdate < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true
      argument :payment_day, Integer, required: false

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        payment_plan = user.payment_plans.find(vals[:id])

        return { payment_plan: payment_plan } if payment_plan.update(vals.slice(:payment_day))

        # error messages if payment day is not updated.
        raise GraphQL::ExecutionError, payment_plan.errors.full_messages&.join(', ')
      rescue ActiveRecord::RecordNotFound
        # error if user or payment plan not found.
        raise GraphQL::ExecutionError, I18n.t('errors.record_not_found')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
