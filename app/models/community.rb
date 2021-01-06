# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_one_attached :image

  has_many :users, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :event_logs, dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :discussions, dependent: :destroy
  has_many :labels, dependent: :destroy
  has_many :businesses, dependent: :destroy
  has_many :entry_requests, dependent: :destroy
  has_many :notes, dependent: :destroy
  has_many :forms, dependent: :destroy
  has_many :land_parcels, dependent: :destroy
  has_many :accounts, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :action_flows, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :invoices, dependent: :destroy
  has_many :email_templates, dependent: :destroy

  VALID_CURRENCIES = %w[zambian_kwacha].freeze

  validates :currency, inclusion: { in: VALID_CURRENCIES, allow_nil: false }

  DOMAINS_COMMUNITY_MAP = {
    'Nkwashi': ['doublegdp.com', 'thebe-im.com'],
    'Femoza': ['doublegdp.com', 'femoza.com'],
  }.freeze

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze

  def attach_image(vals)
    IMAGE_ATTACHMENTS.each_pair do |key, attr|
      send(attr).attach(vals[key]) if vals[key]
    end
  end

  def label_exists?(label_name)
    label = labels.find_by(short_desc: label_name)
    return false if label.nil?

    true
  end

  def domain_admin?(domain)
    DOMAINS_COMMUNITY_MAP[name.to_sym].include?(domain)
  end

  def default_community_users
    users.find(self[:default_users].split(','))
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
