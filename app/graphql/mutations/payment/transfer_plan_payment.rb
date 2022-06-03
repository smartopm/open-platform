# frozen_string_literal: true

module Mutations
  module Payment
    # Transfer single plan payment
    class TransferPlanPayment < BaseMutation
      argument :payment_id, ID, required: true
      argument :destination_plan_id, ID, required: true

      field :payment, Types::PlanPaymentType, null: true
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          payment = context[:site_community].plan_payments.find_by(id: vals[:payment_id])
          raise_payment_related_error(payment)

          source_payment_plan = payment.payment_plan
          destination_payment_plan = Properties::PaymentPlan.find_by(id: vals[:destination_plan_id])
          raise_payment_plan_related_error(destination_payment_plan)

          if destination_payment_plan.transfer_payment(source_payment_plan, payment)
            return { payment: payment.reload }
          end
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :plan_payment, permission: :can_transfer_plan_payment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises error if plan payment is not present or if payment is cancelled
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_related_error(payment)
        error_message = ''
        if payment.nil?
          error_message = I18n.t('errors.plan_payment.not_found')
        elsif payment.status.eql?('cancelled')
          error_message = I18n.t('errors.plan_payment.cannot_transfer_cancelled_payment')
        end

        raise GraphQL::ExecutionError, error_message if error_message.present?
      end

      # Raises GraphQL execution payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan)
        error_message = ''
        if payment_plan.blank?
          error_message = I18n.t('errors.payment_plan.not_found')
        elsif !payment_plan.active?
          error_message = I18n.t('errors.plan_payment.cannot_transfer_to_non_active_plan')
        end

        raise GraphQL::ExecutionError, error_message if error_message.present?
      end
    end
  end
end
