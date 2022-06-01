# frozen_string_literal: true

# Send notifications
class NotificationCreateJob < ApplicationJob
  queue_as :default

  def perform(**args)
    Notifications::Notification.create(args)
  end
end
