# frozen_string_literal: true

require 'email_msg'

namespace :import do
  desc 'Import data from sendgrid'
  task :sendgrid, [:community_name] => :environment do |_t, args|
    puts 'importing messages from sendgrid ...'
    EmailMsg.fetch_emails(args.community_name)
  end
end
