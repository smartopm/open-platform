# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_one_attached :image

  has_many :users, class_name: 'Users::User', dependent: :destroy
  # TODO: roles model is not defined, remove this if not required.
  has_many :roles, dependent: :destroy
  has_many :event_logs, class_name: 'Logs::EventLog', dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :discussions, class_name: 'Discussions::Discussion', dependent: :destroy
  has_many :labels, class_name: 'Labels::Label', dependent: :destroy
  has_many :businesses, dependent: :destroy
  has_many :entry_requests, class_name: 'Logs::EntryRequest', dependent: :destroy
  has_many :notes, class_name: 'Notes::Note', dependent: :destroy
  has_many :forms, class_name: 'Forms::Form', dependent: :destroy
  has_many :land_parcels, class_name: 'Properties::LandParcel', dependent: :destroy
  has_many :accounts, class_name: 'Properties::Account', dependent: :destroy
  has_many :notifications, class_name: 'Notifications::Notification', dependent: :destroy
  has_many :action_flows, class_name: 'ActionFlows::ActionFlow', dependent: :destroy
  has_many :comments, class_name: 'Comments::Comment', dependent: :destroy
  has_many :post_tags, class_name: 'PostTags::PostTag', dependent: :destroy
  has_many :invoices, class_name: 'Payments::Invoice', dependent: :destroy
  has_many :email_templates, class_name: 'Notifications::EmailTemplate', dependent: :destroy
  has_many :substatus_logs, class_name: 'Logs::SubstatusLog', dependent: :destroy
  has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :destroy
  has_many :payments, class_name: 'Payments::Payment', dependent: :destroy
  has_many :import_logs, class_name: 'Logs::ImportLog', dependent: :destroy
  has_many :transactions, dependent: :destroy
  has_many :plan_payments, dependent: :destroy
  has_many :feedbacks, dependent: :destroy

  VALID_CURRENCIES = %w[zambian_kwacha honduran_lempira].freeze

  validates :currency, inclusion: { in: VALID_CURRENCIES, allow_nil: false }

  DOMAINS_COMMUNITY_MAP = {
    'Nkwashi': ['doublegdp.com', 'thebe-im.com'],
    'DoubleGDP': ['doublegdp.com'],
    'Ciudad Morazán': ['doublegdp.com'],
    'DAST': ['doublegdp.com'],
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
