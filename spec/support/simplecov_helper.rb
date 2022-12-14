# frozen_string_literal: true

require 'simplecov'
require 'active_support/core_ext/numeric/time'

module SimpleCovHelper
  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  def self.configure_profile
    SimpleCov.configure do
      load_profile 'test_frameworks'
      track_files '{app,lib,config}/**/*.rb'
      track_files 'db/seeds.rb'
      add_filter '/vendor/ruby/'
      add_filter 'spec/'
      add_group 'Libraries',         'lib'
      add_group 'Assets',            'app/assets'
      add_group 'Channels',          'app/channels'
      add_group 'Controllers',       'app/controllers'
      add_group 'GraphQL',           'app/graphql'
      add_group 'Helpers',           'app/helpers'
      add_group 'Jobs',              'app/jobs'
      add_group 'Mailers',           'app/mailer'
      add_group 'Models',            'app/models'
      add_group 'Services',          'app/services'
      add_group 'Views',             'app/views'
      use_merging true
      merge_timeout 5.days
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize
  end

  def self.start!
    return unless ENV['RAILS_ENV'] == 'test'

    configure_profile

    SimpleCov.start
  end
end
