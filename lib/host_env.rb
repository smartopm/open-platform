# frozen_string_literal: true

# Class to help with different urls for different communities
class HostEnv
  # Method to return respective hostnames for creating links in email, sms and image url
  # Needs to be updated and made more generic as more communities start to come in
  def self.base_url(community)
    prod_url(community.name) if ENV['APP_ENV'].eql?('production')

    community.hostname
  end

  def prod_url(community_name)
    case community_name
    when 'DoubleGDP'
      'demo.doublegdp.com'
    when 'Ciudad Morazán'
      'morazancity.doublegdp.com'
    else
      ENV['HOST']
    end
  end
end
