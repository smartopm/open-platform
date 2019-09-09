# frozen_string_literal: true

# User should encompass all users of the system
# Citizens
# City Administrators
# Workers
# Contractors
class User < ApplicationRecord
  has_many :members

  devise :omniauthable, omniauth_providers: [:google_oauth2]

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
end
