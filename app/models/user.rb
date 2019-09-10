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
    user
  end

  # We may want to do a bit more work here massaing the number entered
  def self.find_via_phone_number(phone_number)
    find(phone_number: phone_number)
  end

  def create_new_phone_token
    token = (Array.new(PHONE_TOKEN_LEN) { SecureRandom.random_number(10) }).join('')
    update(phone_token: token,
           phone_token_expires_at: PHONE_TOKEN_EXPIRATION_MINUTES.minutes.from_now)
    token
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
