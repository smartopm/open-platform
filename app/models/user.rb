# frozen_string_literal: true

# TODO: @mdp break this class up
# rubocop:disable ClassLength

require 'email_msg'
require 'merge_users'
# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  # General user error to return on actions that are not possible
  class UserError < StandardError; end
  include SearchCop

  search_scope :search do
    attributes :name, :phone_number, :user_type, :email
    attributes labels: ['labels.short_desc']
  end

  search_scope :heavy_search do
    attributes :name, :phone_number, :user_type, :email
    attributes labels: ['labels.short_desc']
    attributes date_filter: ['acting_event_log.created_at']
    scope { joins(:acting_event_log).eager_load(:labels) }
  end

  search_scope :plot_number do
    attributes plot_no: ['land_parcels.parcel_number']
  end

  search_scope :search_lite do
    attributes :name, :phone_number, :user_type, :email
  end

  scope :allowed_users, lambda { |current_user|
    policy = UserPolicy.new(current_user, nil)
    allowed_user_types = policy.roles_user_can_see
    relat = where(community_id: current_user.community_id)
    return relat if allowed_user_types == '*'
    if policy.role_can_see_self?
      return relat.where(user_type: allowed_user_types).or(relat.where(id: current_user.id))
    end

    return relat.where(user_type: allowed_user_types)
  }
  scope :by_phone_number, ->(number) { where('phone_number IN (?)', number&.split(',')) }
  scope :by_type, ->(user_type) { where('user_type IN (?)', user_type&.split(',')) }
  scope :by_labels, lambda { |label|
                      joins(:labels).where('labels.short_desc IN (?)',
                                           label&.split(','))
                    }

  belongs_to :community, dependent: :destroy
  has_many :entry_requests, dependent: :destroy
  has_many :granted_entry_requests, class_name: 'EntryRequest', foreign_key: :grantor_id,
                                    dependent: :destroy, inverse_of: :user

  has_many :notes, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :note_comments, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :time_sheets, dependent: :destroy
  has_many :accounts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :discussion_users, dependent: :destroy
  has_many :discussions, through: :discussion_users
  has_many :land_parcels, through: :accounts
  has_many :businesses, dependent: :destroy
  has_many :user_labels, dependent: :destroy
  has_many :contact_infos, dependent: :destroy
  has_many :labels, through: :user_labels
  has_many :assignee_notes, dependent: :destroy
  has_many :acting_event_log, class_name: 'EventLog',
                              foreign_key: :acting_user_id, inverse_of: false, dependent: :destroy
  has_many :tasks, through: :assignee_notes, source: :note
  has_many :activity_points, dependent: :destroy
  has_many :user_form_properties, dependent: :destroy
  has_many :form_users, dependent: :destroy
  has_one_attached :avatar
  has_one_attached :document

  after_create :send_email_msg

  # Track changes to the User
  has_paper_trail

  VALID_USER_TYPES = %w[security_guard admin resident contractor
                        prospective_client client visitor custodian].freeze
  VALID_STATES = %w[valid pending banned expired].freeze
  DEFAULT_PREFERENCE = %w[com_news_sms com_news_email weekly_point_reminder_email].freeze

  enum sub_status: {
    applied: 0,
    architecture_reviewed: 1,
    banned: 2,
    contracted: 3,
    expired: 4,
    in_construction: 5,
    interested: 6,
    moved_in: 7,
    paying: 8,
    ready_for_construction: 9,
  }

  validates :user_type, inclusion: { in: VALID_USER_TYPES, allow_nil: true }
  validates :state, inclusion: { in: VALID_STATES, allow_nil: true }
  validates :sub_status, inclusion: { in: sub_statuses.keys, allow_nil: true }
  validates :name, presence: true
  validate :phone_number_valid?
  after_create :add_notification_preference
  before_save :ensure_default_state

  devise :omniauthable, omniauth_providers: %i[google_oauth2 facebook]

  PHONE_TOKEN_LEN = 6
  PHONE_TOKEN_EXPIRATION_MINUTES = 2880 # Valid for 48 hours

  class PhoneTokenResultInvalid < StandardError; end
  class PhoneTokenResultExpired < StandardError; end

  ATTACHMENTS = {
    avatar_blob_id: :avatar,
    document_blob_id: :document,
  }.freeze

  OAUTH_FIELDS_MAP = {
    email: ->(auth) { auth.info.email },
    name: ->(auth) { auth.info.name },
    provider: ->(auth) { auth.provider },
    uid: ->(auth) { auth.uid },
    image_url: ->(auth) { auth.info.image },
    token: ->(auth) { auth.credentials.token },
    oauth_expires: ->(auth) { auth.credentials.expires },
    oauth_expires_at: ->(auth) { Time.zone.at(auth.credentials.expires_at).utc.to_datetime },
    refresh_token: ->(auth) { auth.credentials.refresh_token },
  }.freeze

  ROLE_PRIVILEGES = {
    avatar_rw: ->(user) { %w[security_guard admin].includes(user.user_type) },
  }.freeze

  ALLOWED_PARAMS_FOR_ROLES = {
    admin: {}, # Everything
    security_guard: { except: %i[state user_type] },
  }.freeze

  def self.from_omniauth(auth, site_community)
    # Either create a User record or update it based on the provider (Google) and the UID
    user = find_or_initialize_from_oauth(auth, site_community)
    OAUTH_FIELDS_MAP.keys.each do |param|
      user[param] = OAUTH_FIELDS_MAP[param][auth]
    end
    user.assign_default_community(site_community)
    user.save!
    user
  end

  def self.find_or_initialize_from_oauth(auth, site_community)
    by_email = site_community.users.find_by(email: auth.info.email)
    return by_email if by_email

    site_community.users.new
  end

  # We may want to do a bit more work here massaing the number entered
  def self.find_any_via_phone_number(phone_number)
    find_by(phone_number: phone_number)
  end

  # We may want to do a bit more work here massaing the number entered
  def find_via_phone_number(phone_number)
    community.users.find_by(phone_number: phone_number)
  end

  def self.lookup_by_id_card_token(token)
    find_by(id: token)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable MethodLength
  def enroll_user(vals)
    enrolled_user = ::User.new(vals.except(*ATTACHMENTS.keys))
    enrolled_user.community_id = community_id
    enrolled_user.expires_at = Time.zone.now + 1.day if vals[:user_type] == 'prospective_client'
    ATTACHMENTS.each_pair do |key, attr|
      enrolled_user.send(attr).attach(vals[key]) if vals[key]
    end
    data = { ref_name: enrolled_user.name, note: '', type: enrolled_user.user_type }
    return enrolled_user unless enrolled_user.save

    generate_events('user_enrolled', enrolled_user, data)
    process_referral(enrolled_user, data)
    enrolled_user
  end

  # rubocop:enable Metrics/AbcSize
  # rubocop:enable MethodLength
  def process_referral(enrolled_user, data)
    return unless user_type != 'admin'

    generate_events('user_referred', enrolled_user, data)
    referral_todo(enrolled_user)
  end

  def referral_todo(vals)
    community.notes.create(
      user_id: vals[:id],
      body: "Contact #{vals[:name]}: Prospective client referred by #{self[:name]}.
      Please reach out to the set up a call or visit.",
      flagged: true,
      author_id: self[:id],
      completed: false,
    )
  end

  def grant!(entry_request_id)
    entry = entry_requests.find(entry_request_id)
    return nil if entry.blank?

    entry.grant!(self)
    entry
  end

  def deny!(entry_request_id)
    entry = entry_requests.find(entry_request_id)
    return nil if entry.blank?

    entry.deny!(self)
    entry
  end

  def generate_events(event_tag, target_obj, data = {})
    ::EventLog.create(acting_user_id: id,
                      community_id: community_id, subject: event_tag,
                      ref_id: target_obj.id,
                      ref_type: target_obj.class.to_s,
                      data: data)
  end

  # rubocop:disable MethodLength
  def generate_note(vals)
    community.notes.create(
      # give the note to the author if no other user
      user_id: vals[:user_id] || self[:id],
      body: vals[:body],
      category: vals[:category],
      description: vals[:description],
      flagged: vals[:flagged],
      author_id: self[:id],
      completed: vals[:completed],
      due_date: vals[:due_date],
      form_user_id: vals[:form_user_id],
    )
  end

  def manage_shift(target_user_id, event_tag)
    user = find_a_user(target_user_id)
    data = { ref_name: user.name, type: user.user_type }
    return unless user

    event = generate_events(event_tag, user, data)

    if event_tag == 'shift_start'
      user.time_sheets.create(started_at: Time.current, shift_start_event_log: event)
    else
      timesheet = user.time_sheets.find_by(ended_at: nil)
      return unless timesheet

      timesheet.update(ended_at: Time.current, shift_end_event_log: event)
      timesheet
    end
  end
  # rubocop:enable MethodLength

  def construct_message(vals)
    mess = messages.new(vals)
    mess[:user_id] = vals[:user_id]
    mess.sender_id = self[:id]
    mess
  end

  def find_user_discussion(id, type)
    if type == 'post'
      community.discussions.find_by(post_id: id)
    else
      community.discussions.find(id)
    end
  end

  def user_form(form_id, user_id)
    if admin?
      community.forms.find(form_id).form_users.find_by(user_id: user_id)
    else
      form_users.find_by(form_id: form_id)
    end
  end

  def find_a_user(a_user_id)
    community.users.allowed_users(self).find(a_user_id)
  end

  def find_label_users(ids)
    query = ids.split(',')
    User.allowed_users(self)
        .includes(:user_labels)
        .where(user_labels: { label_id: query }, community_id: community_id)
  end

  def id_card_token
    # May want to do more to secure this in the future with some extra token
    self[:id]
  end

  %w[admin custodian security_guard].each do |user_type|
    define_method "#{user_type}?" do
      self[:user_type] == user_type
    end
  end

  def role_name
    return '' unless self[:user_type]

    self[:user_type].humanize.titleize
  end

  # Returns status of a user
  # banned, expired, pending, valid
  def state
    self[:state] || 'pending'
  end

  def pending?
    self[:state] == 'pending'
  end

  def expired?
    return false unless self[:expires_at]

    self[:expires_at] < Time.zone.now
  end

  def ensure_default_state
    self[:state] ||= 'pending'
  end

  def create_new_phone_token
    token = (Array.new(PHONE_TOKEN_LEN) { SecureRandom.random_number(10) }).join('')
    update(phone_token: token,
           phone_token_expires_at: PHONE_TOKEN_EXPIRATION_MINUTES.minutes.from_now)
    token
  end

  def domain
    self[:email].split('@').last
  end

  # Assign known hardcoded domains to a community
  # TODO: Make this happen from the DB vs hardcoding
  def assign_default_community(site_community)
    return if self[:community_id].present? && self[:user_type].present?
    return unless %w[google_oauth2 facebook].include?(self[:provider])

    if site_community.domain_admin?(domain)
      update(community_id: site_community.id, user_type: 'admin')
    else
      update(community_id: site_community.id,
             user_type: 'visitor',
             expires_at: Time.current)
    end
  end

  def send_phone_token
    raise UserError, 'No phone number to send one time code to' unless self[:phone_number]

    token = create_new_phone_token
    Rails.logger.info "Sending #{token} to #{self[:phone_number]}"
    Sms.send(self[:phone_number], "Your code is #{token}")
    # Send number via Nexmo
  end

  def send_one_time_login
    raise UserError, 'No phone number to send one time code to' unless self[:phone_number]

    token = create_new_phone_token
    url = "https://#{ENV['HOST']}/l/#{self[:id]}/#{token}"
    msg = "Your login link for #{community.name} is #{url}"
    Rails.logger.info "Sending '#{msg}' to #{self[:phone_number]}"
    Sms.send(self[:phone_number], msg)
    url
  end

  def role?(roles)
    user_type = self[:user_type]
    return false unless user_type

    Array(roles).include?(user_type.to_sym)
  end

  def can_become?(user)
    return false unless role?(%i[admin security_guard])

    return false if user.role?([:admin]) # Don't let anyone become an admin

    user.community_id == community_id
  end

  def verify_phone_token!(token)
    if phone_token == token
      return true if phone_token_expires_at > Time.zone.now

      raise PhoneTokenResultExpired
    end
    raise PhoneTokenResultInvalid
  end

  def auth_token
    JWT.encode({ user_id: self[:id] }, Rails.application.credentials.secret_key_base, 'HS256')
  end

  def self.find_via_auth_token(auth_token, community)
    decoded_token = JWT.decode auth_token,
                               Rails.application.credentials.secret_key_base,
                               true,
                               algorithm: 'HS256'
    payload = decoded_token[0]
    community.users.find(payload['user_id'])
  end

  def send_email_msg
    return if self[:email].nil?

    template = community.templates || {}
    EmailMsg.send_mail(self[:email], template['welcome_template_id'], welcome_mail_data)
  end

  def welcome_mail_data
    {
      "community": community,
      "name": name,
    }
  end

  # catch exceptions in here to be caught in the mutation
  def merge_user(dup_id)
    MergeUsers.merge(dup_id, self[:id])
  end

  def activity_point_for_current_week
    last_monday = if current_time_in_timezone.monday?
                    current_time_in_timezone.beginning_of_day
                  else
                    current_time_in_timezone.prev_occurring(:monday).beginning_of_day
                  end

    activity_points.find_by('created_at >= ?', last_monday)
  end

  # has a better meaning when used on a logged-in user
  def first_login_today?
    user_logins_today = EventLog.where(
      'acting_user_id = ? AND subject = ? AND created_at >= ?',
      id, 'user_login', current_time_in_timezone.beginning_of_day
    )
    user_logins_today.length == 1
  end

  private

  def current_time_in_timezone
    # Should we get timezone from user's community instead?
    Time.now.in_time_zone('Africa/Lusaka')
  end

  def phone_number_valid?
    return nil if self[:phone_number].nil? || self[:phone_number].blank?

    unless self[:phone_number].match(/\A[0-9\+\s\-]+\z/)
      errors.add(:phone_number, "can only contain 0-9, '-', '+' and space")
    end

    # All phone numbers with country codes are between 8-15 characters long
    errors.add(:phone_number, 'must be a valid length') unless self[:phone_number]
                                                               .gsub(/[^0-9]/, '')
                                                               .length.between?(8, 15)
  end

  def add_notification_preference
    DEFAULT_PREFERENCE.each do |pref|
      label = community.labels.find_by(short_desc: pref).presence ||
              community.labels.create!(short_desc: pref)
      user_labels.create!(label_id: label.id)
    end
  end
end
# rubocop:enable ClassLength
