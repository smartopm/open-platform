require_relative 'boot'

require 'rails/all'


ROOT_PATH ||= File.expand_path('../.', __dir__)

# Load local .env files for development
# https://github.com/bkeepers/dotenv
require 'dotenv'
if Rails.env.development?
  Dotenv.load("#{ROOT_PATH}/.env.development.local", "#{ROOT_PATH}.env")
elsif Rails.env.test?
  Dotenv.load("#{ROOT_PATH}/.env.test.local", "#{ROOT_PATH}.env")
end

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DoubleGDP
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end

    config.active_job.queue_adapter = Rails.env.test? ? :async : :sidekiq
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.i18n.available_locales = %i[es en]
    config.i18n.default_locale = :en
  end
end
