# frozen_string_literal: true

# TODO: @mdp break this class up
# rubocop:disable ClassLength

require 'email_msg'
# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  # General user error to return on actions that are not possible
  class UserError < StandardError; end

  belongs_to :community, optional: true
  has_many :entry_requests, dependent: :destroy
  has_many :granted_entry_requests, class_name: 'EntryRequest', foreign_key: :grantor_id,
                                    dependent: :destroy, inverse_of: :user

  has_many :notes, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :time_sheets, dependent: :destroy
  has_many :accounts, dependent: :destroy

  has_one_attached :avatar
  has_one_attached :document

  after_create :send_email_msg

  # Track changes to the User
  has_paper_trail

  VALID_USER_TYPES = %w[security_guard admin resident contractor
                        prospective_client client visitor custodian].freeze
  VALID_STATES = %w[valid pending banned expired].freeze
  validates :user_type, inclusion: { in: VALID_USER_TYPES, allow_nil: true }
  validates :state, inclusion: { in: VALID_STATES, allow_nil: true }
  validates :name, presence: true
  validate :phone_number_valid?
  before_save :ensure_default_state

  devise :omniauthable, omniauth_providers: [:google_oauth2]

  PHONE_TOKEN_LEN = 6
  PHONE_TOKEN_EXPIRATION_MINUTES = 2880 # Valid for 48 hours
  class PhoneTokenResultInvalid < StandardError; end
  class PhoneTokenResultExpired < StandardError; end

  DOMAINS_COMMUNITY_MAP = {
    'doublegdp.com': 'Nkwashi',
    'thebe-im.com': 'Nkwashi',
  }.freeze

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

  def self.from_omniauth(auth)
    # Either create a User record or update it based on the provider (Google) and the UID
    user = find_or_initialize_from_oauth(auth)
    OAUTH_FIELDS_MAP.keys.each do |param|
      user[param] = OAUTH_FIELDS_MAP[param][auth]
    end
    user.assign_default_community
    user.save!
    user
  end

  def self.find_or_initialize_from_oauth(auth)
    by_email = find_by(email: auth.info.email)
    return by_email if by_email

    User.new
  end

  # We may want to do a bit more work here massaing the number entered
  def self.find_via_phone_number(phone_number)
    find_by(phone_number: phone_number)
  end

  def self.lookup_by_id_card_token(token)
    find_by(id: token)
  end

  # rubocop:disable Metrics/AbcSize
  def enroll_user(vals)
    enrolled_user = ::User.new(vals.except(*ATTACHMENTS.keys))
    enrolled_user.community_id = community_id
    enrolled_user.expires_at = Time.zone.now + 1.day if vals[:user_type] == 'prospective_client'
    ATTACHMENTS.each_pair do |key, attr|
      enrolled_user.send(attr).attach(vals[key]) if vals[key]
    end
    data = { ref_name: enrolled_user.name, note: '', type: enrolled_user.user_type }
    generate_events('user_enrolled', enrolled_user, data) if enrolled_user.save
    enrolled_user
  end
  # rubocop:enable Metrics/AbcSize

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

  def find_a_user(a_user_id)
    community.users.find(a_user_id)
  end

  def id_card_token
    # May want to do more to secure this in the future with some extra token
    self[:id]
  end

  def admin?
    self[:user_type] == 'admin'
  end

  def custodian?
    self[:user_type] == 'custodian'
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
  def assign_default_community
    return if self[:community_id]
    return unless self[:provider] == 'google_oauth2'

    mapped_name = DOMAINS_COMMUNITY_MAP[domain.to_sym]
    return unless mapped_name

    community = Community.find_or_create_by(name: mapped_name)
    update(community_id: community.id, user_type: 'admin')
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

  def self.find_via_auth_token(auth_token)
    decoded_token = JWT.decode auth_token,
                               Rails.application.credentials.secret_key_base,
                               true,
                               algorithm: 'HS256'
    payload = decoded_token[0]
    User.find(payload['user_id'])
  end

  def send_email_msg
    EmailMsg.send_welcome_msg(self[:email], self[:name], community.name) unless self[:email].nil?
  end

  private

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
end
# rubocop:enable ClassLength
