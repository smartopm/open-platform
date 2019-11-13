# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :activity_logs, dependent: :destroy

  def notify_slack(message)
    return unless self[:slack_webhook_url]

    slack = Slack.new(self[:slack_webhook_url])
    slack.send(
      username: 'CommunityUpdate',
      icon_emoji: ':trophy:',
      text: message,
    )
  rescue StandardError => e
    # Fail gracefully
    Rollbar.error(e)
  end
end
