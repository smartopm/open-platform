require_relative "#{Rails.root}/lib/sms"

if ENV['environment'] != 'test'
  Sms.setup do |config|
    config[:api_key] = ENV['NEXMO_API_KEY']
    config[:api_secret] = ENV['NEXMO_API_SECRET']
    config[:from] = ENV['NEXMO_API_FROM']
  end
end
