# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Create a new PaymentPlan for a land
    class PaymentPlanCreate < BaseMutation
      argument :land_parcel_id, ID, required: true
      argument :user_id, ID, required: true
      argument :co_owners_ids, [ID], required: false
      argument :status, Integer, required: true
      argument :plan_type, String, required: true
      argument :percentage, String, required: false
      argument :start_date, String, required: true
      argument :installment_amount, Float, required: true
      argument :total_amount, Float, required: true
      argument :duration, Integer, required: true
      argument :payment_day, Integer, required: false
      argument :frequency, Integer, required: true
      argument :renewable, Boolean, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        raise_user_not_found_error(user)

        payment_plan = user.payment_plans.create(vals.except(:co_owners_ids))
        if payment_plan.persisted?
          create_co_owners(payment_plan, vals[:co_owners_ids]) if vals[:co_owners_ids].present?
          return { payment_plan: payment_plan }
        end

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages&.join(',')
      end
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :payment_plan, permission: :can_create_payment_plan)

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

      def create_co_owners(payment_plan, co_owners_ids)
        co_owners_ids.each do |co_owner_id|
          payment_plan.plan_ownerships.create(user_id: co_owner_id)
        rescue ActiveRecord::RecordNotUnique
          next
        end
      end
    end
  end
end
