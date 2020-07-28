# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :event_logs, dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :discussions, dependent: :destroy
  has_many :labels, dependent: :destroy
  has_many :businesses, dependent: :destroy
  has_many :entry_requests, dependent: :destroy
  has_many :notes, dependent: :destroy

  DOMAINS_COMMUNITY_MAP = {
    'Nkwashi': ['doublegdp.com', 'thebe-im.com'],
  }.freeze

  def label_exists?(label_name)
    label = labels.find_by(short_desc: label_name)
    return false if label.nil?

    true
  end

  def assign_or_unassign_user(user_id, note_id)
    notes = users.find(user_id).assignee_notes

    if notes.find_by(note_id: note_id)
      AssigneeNote.find_by(note_id: note_id).delete
    else
      notes.create!(note_id: note_id)
    end
  end

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
