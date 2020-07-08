# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :event_logs, dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :discussions, dependent: :destroy
  has_many :labels, dependent: :destroy

  DOMAINS_COMMUNITY_MAP = {
    'Nkwashi': ['doublegdp.com', 'thebe-im.com'],
  }.freeze

  def domain_admin?(domain)
    DOMAINS_COMMUNITY_MAP[name.to_sym].include?(domain)
  end

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
