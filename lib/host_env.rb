# frozen_string_literal: true

# Class to help with different urls for different communities
class HostEnv
  # Method to return respective hostnames for creating links in email, sms and image url
  # Needs to be updated and made more generic as more communities start to come in
  # rubocop:disable Metrics/MethodLength
  def self.base_url(community)
    if ENV['APP_ENV'].eql?('production')
      case community.name
      when 'DoubleGDP'
        return 'demo.doublegdp.com'
      when 'Ciudad Morazán'
        return 'morazancity.doublegdp.com'
      when 'Tilisi'
        return 'tilisi.doublegdp.com'
      when 'Greenpark'
        return 'greenpark.doublegdp.com'
      else
        return ENV['HOST']
      end
    end

    community.hostname
  end
  # rubocop:enable Metrics/MethodLength
end
