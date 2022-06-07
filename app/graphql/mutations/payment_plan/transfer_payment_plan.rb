# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Transfers PaymentPlan to other LandParcel.
    class TransferPaymentPlan < BaseMutation
      argument :source_plan_id, ID, required: true
      argument :destination_plan_id, ID, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        source_payment_plan = Properties::PaymentPlan.find_by(id: vals[:source_plan_id])
        destination_payment_plan = Properties::PaymentPlan.find_by(id: vals[:destination_plan_id])
        raise_payment_plan_related_error(source_payment_plan, :source)
        raise_payment_plan_related_error(destination_payment_plan, :destination)
        ActiveRecord::Base.transaction do
          source_payment_plan.lock!
          destination_payment_plan.lock!
          destination_payment_plan.transfer_payments(source_payment_plan)
          return { payment_plan: destination_payment_plan.reload } if source_payment_plan.cancel!
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :payment_plan, permission: :can_transfer_payment_plan)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Style/GuardClause
      # Raises GraphQL execution payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan, type)
        if payment_plan.blank?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
        elsif payment_plan.cancelled?
          if type.eql?(:destination)
            raise GraphQL::ExecutionError,
                  I18n.t('errors.payment_plan.cannot_transfer_to_cancelled_plan')
          elsif type.eql?(:source) && !payment_plan.plan_payments.exists?(status: :paid)
            raise GraphQL::ExecutionError,
                  I18n.t('errors.payment_plan.transfer_can_not_be_processed')
          end
        end
      end
      # rubocop:enable Style/GuardClause
      # rubocop:enable Metrics/MethodLength
    end
  end
end
