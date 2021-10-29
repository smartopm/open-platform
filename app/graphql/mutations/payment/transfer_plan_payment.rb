# frozen_string_literal: true

module Mutations
  module Payment
    # Transfer single plan payment
    class TransferPlanPayment < BaseMutation
      argument :payment_id, ID, required: true
      argument :destination_plan_id, ID, required: true

      field :payment, Types::PlanPaymentType, null: true
      def resolve(vals)
        payment = context[:site_community].plan_payments.find_by(id: vals[:payment_id])
        raise_payment_related_error(payment)

        source_payment_plan = payment.payment_plan
        destination_payment_plan = Properties::PaymentPlan.find_by(id: vals[:destination_plan_id])
        raise_payment_plan_related_error(destination_payment_plan)

        if destination_payment_plan.transfer_payment(source_payment_plan, payment)
          return { payment: payment.reload }
        end

        raise GraphQL::ExecutionError, payment.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(admin: true, module: :plan_payment, permission: :can_transfer_plan_payment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # rubocop:disable Style/GuardClause
      # Raises error if plan payment is not present or if payment is cancelled
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_related_error(payment)
        if payment.nil?
          raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
        elsif payment.status.eql?('cancelled')
          raise GraphQL::ExecutionError,
                I18n.t('errors.plan_payment.cannot_transfer_cancelled_payment')
        end
      end

      # Raises GraphQL execution payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan)
        if payment_plan.blank?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
        elsif payment_plan.cancelled?
          raise GraphQL::ExecutionError,
                I18n.t('errors.plan_payment.cannot_transfer_to_cancelled_plan')
        end
      end
      # rubocop:enable Style/GuardClause
    end
  end
end
