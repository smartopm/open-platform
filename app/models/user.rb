# frozen_string_literal: true

# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  has_many :members, dependent: :destroy

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
    user.save!
    user.assign_default_community
    user
  end

  # We may want to do a bit more work here massaing the number entered
  def self.find_via_phone_number(phone_number)
    find_by(phone_number: phone_number)
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
    return unless members.empty?
    return unless self[:provider] == 'google_oauth2'

    mapped_name = DOMAINS_COMMUNITY_MAP[domain.to_sym]
    return unless mapped_name

    community = Community.find_or_create_by(name: mapped_name)
    members.create(community_id: community.id, member_type: 'admin')
  end

  def send_phone_token
    Rails.logger.info "Sending #{self[:phone_token]} to #{self[:phone_number]}"
    # Send number via Nexmo
  end

  def verify_phone_token!(token)
    if phone_token == token
      return true if phone_token_expires_at > Time.zone.now

      raise PhoneTokenResultExpired
    end
    raise PhoneTokenResultInvalid
  end
end
