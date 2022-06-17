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
                     .where(notifable_type: 'Notifications::Message')
                                  &.update_all(seen_at: Time.zone.now)

        return { success: true } if msg_notify

        raise GraphQL::ExecutionError, msg_notify.errors.full_messages&.join(', ')
      end
      # rubocop:enable Rails/SkipsModelValidations

      # Verifies if current user is present or not.
      def authorized?
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
