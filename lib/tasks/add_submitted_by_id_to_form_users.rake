# frozen_string_literal: true

namespace :db do
  desc 'Add submitted_by_id to form users tables'
  task add_submitted_by_id_to_form_users: :environment do
    ActiveRecord::Base.transaction do
      Forms::FormUser.find_each do |form_user|
        puts "#{form_user.user.name} ..."
        submitted_by = form_user.user
        form_user.update!(submitted_by_id: submitted_by.id)
      end
      puts 'Successfully added submitted_by to form_users.'
    end
  rescue StandardError => e
    puts 'Failed to add added submitted_by_id to form_users'
    puts e.message.to_s
  end
end
