# frozen_string_literal: true

require 'slack'

# alert user if there is new posts related to the the tag a user is subscribed to
class CheckCriticalBusinessActivityJob < ApplicationJob
  queue_as :default
  # rubocop:disable Metrics/AbcSize
  def perform(communities)
    return unless Rails.env.production?

    nkwashi = Community.find_by(name: communities.first)
    cm = Community.find_by(name: communities.last)
    send_slack_notification(nkwashi, 'gate_activity') unless
                        gate_activity_in_24_hours(nkwashi).positive?

    send_slack_notification(cm, 'gate_activity') unless gate_activity_in_24_hours(cm).positive?

    send_slack_notification(nkwashi, 'time_activity') unless
                          time_entry_activity_in_24_hours(nkwashi).positive?

    send_slack_notification(nkwashi, 'payment_activity') unless
                            payment_activity_in_24_hours(nkwashi).positive?
  end
  # rubocop:enable Metrics/AbcSize

  private

  def payment_activity_in_24_hours(community)
    return unless community

    now = current_time_in_time_zone(community.timezone)
    activity_window = now.ago(3.days)
    community.plan_payments
             .not_cancelled
             .eager_load(:user)
             .where(created_at: activity_window)
             .count
  end

  def gate_activity_in_24_hours(community)
    return unless community

    now = current_time_in_time_zone(community.timezone)
    activity_window = now.ago(1.day)

    community.event_logs
             .eager_load(:acting_user)
             .where(
               subject: %w[user_entry visitor_entry],
               created_at: activity_window,
             ).count
  end

  def time_entry_activity_in_24_hours(community)
    return unless community

    now = current_time_in_time_zone(community.timezone)
    activity_window = now.ago(1.day)

    return if activity_window.sunday?

    nil # TODO: Olvier, Saurabh how to check timesheets log on community level
  end

  def current_time_in_time_zone(timezone)
    Time.now.in_time_zone(timezone)
  end

  def send_slack_notification(community, activity)
    return unless community.slack_webhook_url

    slack = Slack.new(community.slack_webhook_url)
    slack.send(
      username: 'prod-eng',
      icon_emoji: ':information_source:',
      text: message(community.name, activity),
    )
  rescue StandardError => e
    # Fail gracefully
    Rollbar.error(e)
  end

  def message(community, activity)
    case activity
    when 'gate_activity'
      "No Gate Activity recorded for #{community} in the past 24 hours"
    when 'payment_activity'
      "No Payment Activity recorded for #{community} in the past 3 days"
    when 'time_activity'
      "No Time Entry activity recorded for #{community} in the past 24 hours"
    end
  end
end
