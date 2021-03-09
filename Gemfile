source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '>=2.6.2'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '6.0.3.5'
# Use sqlite3 as the database for Active Record
gem 'pg', '~> 1.1.4'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 5'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 4.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

# Gem to load local .env files
gem 'dotenv'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "nexmo", "~> 5.9"
gem 'sendgrid-ruby'

# For S3 file uploads in ActiveStorage
gem "aws-sdk-s3", require: false

gem 'repost'
# Auth stuff
gem "omniauth-google-oauth2", "~> 0.8.0"
gem 'omniauth-rails_csrf_protection'
# https://github.com/heartcombo/devise/pull/5327
gem "devise", github: "heartcombo/devise", branch: "master"
gem 'jwt'
gem "omniauth-facebook", "~> 8.0.0"

# QR Code library for building SVG's
gem 'rqrcode'

# Sidekiq for jobs
gem 'sidekiq'
gem "sidekiq-scheduler", "~> 3.0"

gem 'serviceworker-rails'

# GraphQL
gem 'graphql', "1.11.6"
gem 'graphiql-rails', group: :development
gem 'graphql-guard'

# PaperTrail for auditing and tracking changes
gem 'paper_trail'

# Rollbar for error logging
gem 'rollbar'

# full text searching on models
gem 'search_cop'

# dynamic logic using json
gem 'json_logic'

# for reading and xls and xlsx files
gem "roo", "~> 2.8.0"

# To get visual metrics of heroku deployment
gem "barnes"
gem "newrelic_rpm"

# web scrapping and parsing html files
 gem 'nokogiri'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]

  gem "rubocop", "~> 0.77"
  gem "pronto", "~> 0.10.0"
  gem "rubocop-rails", "~> 2.3"

  # RSpec
  # TODO: @mdp figure out why this needs bundle run twice
  gem 'rspec-rails', git: 'https://github.com/rspec/rspec-rails', branch: 'main'
  gem 'rspec-core', git: 'https://github.com/rspec/rspec-core', branch: 'main'
  gem 'rspec-expectations', git: 'https://github.com/rspec/rspec-expectations', branch: 'main'
  gem 'rspec-mocks', git: 'https://github.com/rspec/rspec-mocks', branch: 'main'
  gem 'rspec-support', git: 'https://github.com/rspec/rspec-support', branch: 'main'
  gem 'rails-controller-testing'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
  gem 'factory_bot'
  gem 'simplecov'
  gem 'shoulda-matchers'
  gem 'shoulda-callback-matchers', '~> 1.1.1'
end


gem "request_store", "~> 1.4"

