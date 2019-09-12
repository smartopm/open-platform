require_relative "#{Rails.root}/lib/sms"

credentials = Rails.application.credentials

if ENV['environment'] != 'test'
  Sms.setup do |config|
    config[:api_key] = credentials.nexmo_api_key
    config[:api_secret] = credentials.nexmo_api_secret
    config[:from] = credentials.nexmo_api_from
  end
end
