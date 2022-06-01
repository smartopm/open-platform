# frozen_string_literal: true

# Notification queries
module Types::Queries::Notification
  extend ActiveSupport::Concern

  included do
    field :seen_notifications, [Types::NotificationType], null: false do
      description 'fetch seen notifications'
    end

    field :unseen_notifications, [Types::NotificationType], null: false do
      description 'fetch unseen notifications'
    end
  end

  def seen_notifications
    raise_unauthorized_error

    context[:current_user].notifications.where('seen_at > ?', 24.hours.ago)
  end

  def unseen_notifications
    raise_unauthorized_error

    context[:current_user].notifications.where(seen_at: nil).where('created_at > ?', 24.hours.ago)
  end

  def raise_unauthorized_error
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?
  end
end
