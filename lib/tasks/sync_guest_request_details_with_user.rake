# frozen_string_literal: true

namespace :db do
  desc 'Update guest request details'
  task sync_guest_details_with_user: :environment do
    ActiveRecord::Base.transaction do
      Logs::EntryRequest.where.not(guest_id: nil).find_each do |request|
        request.guest.update_associated_request_details
      end
      puts 'Updated all user associated guest details'
    end
  rescue StandardError => e
    puts 'Failed to update guest request details'
    puts e.message.to_s
  end
end
