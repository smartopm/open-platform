# frozen_string_literal: true
require 'email_msg'

namespace :import do
  desc 'Import data from sendgrid'
  task :sendgrid, [:community_id] => :environment do |t, args| 
  	puts 'importing messages from sendgrid ...'
	EmailMsg.save_sendgrid_messages(args.community_id)    
  end
end