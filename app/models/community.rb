# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
# TODO: @mdp break this class up
# rubocop:disable Metrics/ClassLength
class Community < ApplicationRecord
  class CommunityError < StandardError; end
  has_one_attached :image

  COMMUNITY_FEATURES = [
    'Dashboard', 'Search', 'Profile', 'Messages', 'Communication', 'LogBook', 'Payments',
    'Invoices', 'Transactions', 'Forms', 'Customer Journey', 'UserStats', 'Users',
    'Properties', 'News', 'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business',
    'Forms', 'Email Templates', 'Community', 'Contact', 'Referral', 'My Thebe Portal',
    'Action Flows', 'Time Card', 'Logout', 'Showroom', 'DynamicMenu', 'Guest List', 'Processes',
    'Task Lists', 'Amenity'
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
  has_many :processes, class_name: 'Processes::Process', dependent: :destroy
  has_many :note_lists, class_name: 'Notes::NoteList', dependent: :destroy
  belongs_to :sub_administrator, class_name: 'Users::User', optional: true
  has_many :time_sheets, class_name: 'Users::TimeSheet', dependent: :destroy
  has_many :entry_times, class_name: 'Logs::EntryTime', dependent: :destroy
  has_many :lead_logs, class_name: 'Logs::LeadLog', dependent: :destroy
  has_many :posts, class_name: 'Discussions::Post', dependent: :destroy
  has_many :transaction_logs, class_name: 'Payments::TransactionLog', dependent: :destroy
  has_many :amenities, dependent: :destroy

  VALID_CURRENCIES = %w[zambian_kwacha honduran_lempira kenyan_shilling costa_rican_colon
                        nigerian_naira american_dollar].freeze

  validates :currency, inclusion: { in: VALID_CURRENCIES, allow_nil: false }

  DOMAINS_COMMUNITY_MAP = {
    'Nkwashi': ['doublegdp.com', 'thebe-im.com'],
    'DoubleGDP': ['doublegdp.com'],
    'Ciudad Morazán': ['doublegdp.com'],
    'Tilisi': ['doublegdp.com'],
    'Greenpark': ['doublegdp.com'],
    'Enyimba': ['doublegdp.com'],
    'Metropolis': ['doublegdp.com'],
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
    return unless new_record?

    features = {}
    COMMUNITY_FEATURES.each do |key|
      features[key] = { features: [] }
    end
    self.features = features
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def craft_sms(**params)
    raise CommunityError, 'No phone numbers to send sms to' if sms_phone_numbers.blank?

    task_url = "https://#{HostEnv.base_url(self)}/tasks/#{params[:note_id]}"
    user_initiated_message = I18n.t('emergency_sos.user_initiated_message',
                                    user_name: params[:current_user].name)
    from_location_message = I18n.t('emergency_sos.from_location_message',
                                   google_map_url: params[:google_map_url])
    can_be_reached_on_message = I18n.t('emergency_sos.reached_on_message',
                                       phone_number: params[:current_user].phone_number)

    if params[:current_user].phone_number.present?
      message = if params[:google_map_url].present?
                  "#{user_initiated_message} #{from_location_message} #{can_be_reached_on_message}"
                else
                  "#{user_initiated_message} #{I18n.t('emergency_sos.location_not_found')} " \
                  "#{can_be_reached_on_message}"
                end
    elsif params[:google_map_url].present?
      message = "#{user_initiated_message} #{from_location_message} " \
                "#{I18n.t('emergency_sos.contact_not_found')}"
    else
      message = "#{user_initiated_message} " \
                "#{I18n.t('emergency_sos.location_and_contact_not_found')}"
    end
    message += " #{I18n.t('emergency_sos.receiving_message', name: name, task_url: task_url)}"
    send_sms(message)
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def craft_am_safe_sms(**params)
    message = I18n.t('emergency_sos.am_safe_message', user_name: params[:current_user].name)
    send_sms(message)
  end

  def send_sms(message)
    sms_phone_numbers.each  do |sms_phone_number|
      Rails.logger.info "Sending #{sms_phone_number}"
      Sms.send(sms_phone_number, message)
    end
  end

  # rubocop:disable Rails/FindBy
  def drc_form_users
    form_name = 'DRC Project Review Process'
    drc_form = forms.where('name ILIKE ?', "#{form_name}%").first
    return unless drc_form

    drc_ids = forms.where(grouping_id: drc_form.grouping_id).pluck(:id)
    Forms::FormUser.where(form_id: drc_ids)
  end
  # rubocop:enable Rails/FindBy
  # rubocop:enable Metrics/ClassLength

  def process_form_users(process_id)
    forms.joins(:process).find_by(process: { id: process_id })&.form_users
  end
end
