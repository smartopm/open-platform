# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new PaymentPlan for a land
    class PaymentPlanCreate < BaseMutation
      argument :land_parcel_id, ID, required: true
      argument :user_id, ID, required: true
      argument :status, Integer, required: true
      argument :plan_type, String, required: true
      argument :percentage, String, required: true
      argument :start_date, String, required: true
      argument :monthly_amount, Float, required: true
      argument :total_amount, Float, required: true
      argument :duration_in_month, Integer, required: true
      argument :payment_day, Integer, required: false

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        raise_user_not_found_error(user)

        payment_plan = user.payment_plans.create(vals.except(:user_id))
        return { payment_plan: payment_plan } if payment_plan.persisted?

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      rescue ActiveRecord::RecordNotUnique
        raise_payment_plan_not_found_error
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
      end

      # Raises GraphQL execution payment plan already exist for land parcel error.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_not_found_error
        raise GraphQL::ExecutionError,
              I18n.t('errors.payment_plan.plan_already_exist')
      end
    end
  end
end
