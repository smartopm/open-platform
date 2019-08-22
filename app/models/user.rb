# frozen_string_literal: true

class User < ApplicationRecord

  devise :omniauthable, :omniauth_providers => [:google_oauth2]

  def self.from_omniauth(auth)
    info = auth.info
    # Either create a User record or update it based on the provider (Google) and the UID   
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.email = info.email
      user.name = info.name
      user.image_url = info.image
      user.token = auth.credentials.token
      user.expires = auth.credentials.expires
      user.expires_at = Time.at(auth.credentials.expires_at).to_datetime
      user.refresh_token = auth.credentials.refresh_token
      user.save!
    end
  end

end
