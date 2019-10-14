# frozen_string_literal: true

# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  belongs_to :community, optional: true
  has_many :activity_logs, dependent: :destroy

  VALID_USER_TYPES = %w[security_guard admin resident contractor].freeze
  VALID_STATES = %w[valid pending banned expired].freeze

  validates :user_type, inclusion: { in: VALID_USER_TYPES, allow_nil: true }
  validates :state, inclusion: { in: VALID_STATES, allow_nil: true }
  validates :name, presence: true
  before_save :ensure_default_state

  devise :omniauthable, omniauth_providers: [:google_oauth2]

  PHONE_TOKEN_LEN = 6
  PHONE_TOKEN_EXPIRATION_MINUTES = 15
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
    expires: ->(auth) { auth.credentials.expires },
    expires_at: ->(auth) { Time.zone.at(auth.credentials.expires_at).utc.to_datetime },
    refresh_token: ->(auth) { auth.credentials.refresh_token },
  }.freeze

  def self.from_omniauth(auth)
    # Either create a User record or update it based on the provider (Google) and the UID
    user = where(provider: auth.provider, uid: auth.uid).first_or_initialize
    OAUTH_FIELDS_MAP.keys.each do |param|
      user[param] = OAUTH_FIELDS_MAP[param][auth]
    end
    user.assign_default_community
    user.save!
    user
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
    return 'expired' if expired?

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
    Rails.logger.info "Sending #{self[:phone_token]} to #{self[:phone_number]}"
    # Send number via Nexmo
  end

  def last_activity_at
    return self[:last_activity_at] if self[:last_activity_at]
    return activity_logs.last.created_at unless activity_logs.empty?

    nil
  end

  def verify_phone_token!(token)
    if phone_token == token
      return true if phone_token_expires_at > Time.zone.now

      raise PhoneTokenResultExpired
    end
    raise PhoneTokenResultInvalid
  end
end
