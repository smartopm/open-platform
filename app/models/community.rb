# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  class CommunityError < StandardError; end
  has_one_attached :image

  COMMUNITY_FEATURES = [
    'Dashboard', 'Search', 'Profile', 'Messages', 'Communication', 'LogBook', 'Payments',
    'Invoices', 'Transactions', 'Forms', 'Customer Journey', 'UserStats', 'Users',
    'Properties', 'News', 'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business',
    'Forms', 'Email Templates', 'Community', 'Contact', 'Referral', 'My Thebe Portal',
    'Action Flows', 'Time Card', 'Logout', 'Showroom', 'DynamicMenu'
  ].freeze

  after_initialize :add_default_community_features

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
  has_many :transactions, class_name: 'Payments::Transaction', dependent: :destroy
  has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :destroy
  has_many :feedbacks, class_name: 'Users::Feedback', dependent: :destroy
  has_many :subscription_plans, class_name: 'Payments::SubscriptionPlan', dependent: :destroy
  belongs_to :sub_administrator, class_name: 'Users::User', optional: true

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

  def add_default_community_features
    self.features = COMMUNITY_FEATURES if new_record?
  end

  # rubocop:disable Layout/LineLength
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/AbcSize
  def craft_sms(**params)
    raise CommunityError, 'No phone numbers to send sms to' if sms_phone_numbers.blank?

    puts"Phone number #{params[:current_user].phone_number}"

    puts"Map url is defined #{params[:google_map_url]}"

    task_url = "https://#{HostEnv.base_url(self)}/tasks/#{params[:note_id]}"
    if params[:current_user].phone_number.present? && params[:google_map_url] != nil

      message = "Emergency SOS #{params[:current_user].name} has initiated an emergency support request rom this approximate #{params[:google_map_url]} and can likely be reached on #{params[:current_user].phone_number}."
    end

    if params[:current_user].phone_number.present? && params[:google_map_url] == nil
      
      message =  "Emergency SOS #{params[:current_user].name} has initiated an emergency support request and do not have approximate location in our system and can likely be reached on #{params[:current_user].phone_number}."

    end

    if params[:google_map_url] != nil && params[:current_user].phone_number.blank?
      message =  "Emergency SOS #{params[:current_user].name} has initiated an emergency support request from this approximate location #{params[:google_map_url]} and do not have a contact number in our system."
    end

    if params[:google_map_url] == nil && params[:current_user].phone_number.blank?
      message =  "Emergency SOS #{params[:current_user].name} has initiated an emergency support request and do not have approximate location a contact number in our system."
    end

    message += " You are receiving this message as you are a member of the emergency escalation team for #{name}. Please confirm the person is safe and the emergency is resolved, then mark as complete #{task_url}"
    send_sms(message)
  end

  # rubocop:enable Layout/LineLength
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/AbcSize
  def send_sms(message)
    sms_phone_numbers.each  do |sms_phone_number|
      Rails.logger.info "Sending #{sms_phone_number}"
      Sms.send(sms_phone_number, message)
    end
  end
end
