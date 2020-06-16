# frozen_string_literal: true

require 'email_msg'

namespace :import do
  desc 'Import data from sendgrid'
  task :sendgrid, %i[community_name date_from] => :environment do |_t, args|
    puts 'importing messages from sendgrid ...'
    EmailMsg.fetch_emails(args.community_name, args.date_from)
  end
end
