# frozen_string_literal: true

# Alert clients to get more points
class PointsAutoAlertJob < ApplicationJob
  queue_as :default

  def perform
    return unless Rails.env.production?

    Community.all.each do |c|
      template_id = c.templates&.dig('points_auto_alert_template_id')
      next unless template_id

      c.users.where(user_type: 'client').find_each do |u|
        EmailMsg.send_mail(u.email, template_id, 'url': ENV['HOST'])
      rescue StandardError
        next
      end
    end
  end
end
