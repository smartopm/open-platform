# frozen_string_literal: true

# TODO: @mdp break this class up
# rubocop:disable ClassLength

# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  belongs_to :community, optional: true
  has_many :entry_requests, dependent: :destroy
  has_many :granted_entry_requests, class_name: 'EntryRequest', foreign_key: :grantor_id,
                                    dependent: :destroy, inverse_of: :user

  has_one_attached :avatar
  has_one_attached :document

  # Track changes to the User
  has_paper_trail

  VALID_USER_TYPES = %w[security_guard admin resident contractor prospective_client client].freeze
  VALID_STATES = %w[valid pending banned expired].freeze
  validates :user_type, inclusion: { in: VALID_USER_TYPES, allow_nil: true }
  validates :state, inclusion: { in: VALID_STATES, allow_nil: true }
  validates :name, presence: true
  validate :phone_number_valid?
  before_save :ensure_default_state

  devise :omniauthable, omniauth_providers: [:google_oauth2]

  PHONE_TOKEN_LEN = 6
  PHONE_TOKEN_EXPIRATION_MINUTES = 10
  class PhoneTokenResultInvalid < StandardError; end
  class PhoneTokenResultExpired < StandardError; end

  DOMAINS_COMMUNITY_MAP = {
    'doublegdp.com': 'Nkwashi',
    'thebe-im.com': 'Nkwashi',
  }.freeze

  OAUTH_FIELDS_MAP = {
    email: ->(auth) { auth.info.email },
    name: ->(auth) { auth.info.name },
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
    user = where(provider: auth.provider, uid: auth.uid).first_or_initialize
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

    where(provider: auth.provider, uid: auth.uid).first_or_initialize
  end

  # We may want to do a bit more work here massaing the number entered
  def self.find_via_phone_number(phone_number)
    find_by(phone_number: phone_number)
  end

  def self.lookup_by_id_card_token(token)
    find_by(id: token)
  end

  def id_card_token
    # May want to do more to secure this in the future with some extra token
    self[:id]
  end

  def admin?
    self[:user_type] == 'admin'
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
    token = create_new_phone_token
    Rails.logger.info "Sending #{token} to #{self[:phone_number]}"
    Sms.send(self[:phone_number], "Your code is #{token}")
    # Send number via Nexmo
  end

  def send_one_time_login
    token = create_new_phone_token
    msg = "Your login link for #{community.name} is https://#{ENV['HOST']}/l/#{self[:id]}/#{token}"
    Rails.logger.info "Sending '#{msg}' to #{self[:phone_number]}"
    Sms.send(self[:phone_number], msg)
  end

  def role?(roles)
    user_type = self[:user_type]
    return false unless user_type

    Array(roles).include?(user_type.to_sym)
  end

  def can_become?(user)
    return false unless role?([:admin, :security_guard])

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
