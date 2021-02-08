# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new PaymentPlan for a land
    class PaymentPlanCreate < BaseMutation
      argument :land_parcel_id, ID, required: true
      argument :status, Integer, required: true
      argument :plan_type, String, required: true
      argument :percentage, String, required: true
      argument :start_date, GraphQL::Types::ISO8601DateTime, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      # rubocop:disable  Metrics/AbcSize
      def resolve(vals)
        accounts = context[:site_community].land_parcels.find(vals[:land_parcel_id])&.accounts
        raise GraphQL::ExecutionError, 'LandParcel has no owner' if accounts.nil?

        user = context[:site_community].users.find_by(id: accounts.first.user_id)
        raise GraphQL::ExecutionError, 'Owner not found' if user.nil?

        payment_plan = user.payment_plans.create!(vals)
        return { payment_plan: payment_plan } if payment_plan.persisted?

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      end
      # rubocop:enable  Metrics/AbcSize

      # make sure there is no other active payment_plans for a given land_parcel
      def validate_land_parcel(land_parcel_id)
        plans = context[:site_community].land_parcels.find(land_parcel_id).payment_plans
        return false if plans.active.present?
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
