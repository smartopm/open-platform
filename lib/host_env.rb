# frozen_string_literal: true

# Class to help with different urls for different communities
class HostEnv
  # Method to return respective hostnames for creating links in email, sms and image url
  # Needs to be updated and made more generic as more communities start to come in
  def self.base_url(community)
    if ENV['APP_ENV'].eql?('production')
      return 'demo.doublegdp.com' if community.name.eql?('Doublegdp')

      return ENV['HOST']
    end

    community.hostname
  end
end
