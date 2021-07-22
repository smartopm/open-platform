# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Transfers PaymentPlan to other LandParcel.
    class TransferPaymentPlan < BaseMutation
      argument :payment_plan_id, ID, required: true
      argument :land_parcel_id, ID, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        payment_plan = Properties::PaymentPlan.find_by(id: vals[:payment_plan_id])
        raise_payment_plan_related_error(payment_plan)

        user = payment_plan.user
        land_parcel = user.land_parcels.find_by(id: vals[:land_parcel_id])
        raise_land_parcel_not_found_error(land_parcel)

        ActiveRecord::Base.transaction do
          plan_attributes = payment_plan.attributes.except(
            'id',
            'land_parcel_id',
            'created_at',
            'updated_at',
          )
          new_payment_plan = land_parcel.payment_plans.create!(plan_attributes)
          new_payment_plan.transfer_payments(payment_plan)
          return { payment_plan: new_payment_plan.reload } if payment_plan.cancel!

          raise GraphQL::ExecutionError, payment_plan.errors.full_messages
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # rubocop:disable Style/GuardClause
      # Raises GraphQL execution payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan)
        if payment_plan.blank?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
        elsif payment_plan.cancelled?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.transfer_can_not_be_processed')
        end
      end
      # rubocop:enable Style/GuardClause

      # Raises GraphQL execution error if land parcel does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_land_parcel_not_found_error(land_parcel)
        return if land_parcel

        raise GraphQL::ExecutionError, I18n.t('errors.land_parcel.not_found')
      end
    end
  end
end
