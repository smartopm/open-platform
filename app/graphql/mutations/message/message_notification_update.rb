# frozen_string_literal: true

module Mutations
  module Message
    # MessageNotificationUpdate
    class MessageNotificationUpdate < BaseMutation
      field :success, GraphQL::Types::Boolean, null: false

      # rubocop:disable Rails/SkipsModelValidations
      def resolve
        msg_notify = context[:current_user]
                     .notifications
                     .where(notifable_type: 'Message')
                                  &.update_all(seen_at: Time.zone.now)

        return { success: true } if msg_notify

        raise GraphQL::ExecutionError, msg_notify.errors.full_message
      end
      # rubocop:enable Rails/SkipsModelValidations

      def authorized?
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
