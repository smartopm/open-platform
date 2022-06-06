# frozen_string_literal: true

# Notification queries
module Types::Queries::Notification
  extend ActiveSupport::Concern

  included do
    field :user_notifications, [Types::NotificationType], null: false do
      description 'fetch user notifications'
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :notifications_count, Integer, null: false do
      description 'fetch notifications count'
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def user_notifications(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    unseen_notifications = context[:current_user].notifications
                                                 .active
                                                 .where(seen_at: nil)
                                                 .offset(offset)
                                                 .limit(limit)
                                                 .ordered
                                                 
    seen_notifications = context[:current_user].notifications
                                               .active
                                               .where('seen_at > ?', 24.hours.ago)
                                               .ordered_by_seen_at

    unseen_notifications.to_a.concat(seen_notifications)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MetricMethodLength

  def notifications_count
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:current_user].notifications.active.where(seen_at: nil).count
  end
end
