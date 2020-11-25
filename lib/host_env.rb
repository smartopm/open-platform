# frozen_string_literal: true

# Class to help with different urls for different communities
class HostEnv
  # Method to return respective hostnames for creating links in email and sms
  # Needs to be updated and made more generic as more communities start to come in
  def self.base_url(community)
    return ENV['HOST'] if ENV['APP_ENV'].eql?('production')

    community.hostname
  end
end
