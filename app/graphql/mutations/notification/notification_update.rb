# frozen_string_literal: true

module Mutations
  module Notification
    # Update notification
    class NotificationUpdate < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: true

      def resolve(id:)
        notification = context[:current_user].notifications.find(id)
        return { success: false } unless notification.seen_at.nil?

        return { success: true }  if notification.update(seen_at: Time.zone.now)

        raise GraphQL::ExecutionError, notification.errors.full_messages&.join(', ')
      end

      def authorized?(_vals)
        return true if context[:current_user].present?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
