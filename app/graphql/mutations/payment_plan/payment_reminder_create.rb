# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Set payment reminder
    class PaymentReminderCreate < BaseMutation
      argument :payment_reminder_fields, [Types::PaymentReminderInput], required: true

      field :message, String, null: false

      def resolve(vals)
        reminder_details = []
        vals[:payment_reminder_fields].each do |reminder_input|
          reminder_details << { user_id: reminder_input[:user_id],
                                payment_plan_id: reminder_input[:payment_plan_id] }
        end
        PaymentReminderJob.perform_later(context[:site_community], reminder_details)

        { message: 'Sucess' }
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(module: :payment_plan, permission: :can_send_payment_reminder) ||
                       context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.does_not_exist')
      end

      # Raises GraphQL execution error if payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_plan_not_found_error(payment_plan)
        return if payment_plan

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
      end
    end
  end
end
