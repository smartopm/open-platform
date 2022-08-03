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
        return true if permitted?(module: :payment_plan, permission: :can_send_payment_reminder)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
