# frozen_string_literal: true

namespace :db do
  desc 'Associate invites with entry request'
  task associate_invites_with_entry_request: :environment do
    ActiveRecord::Base.transaction do
      Logs::Invite.where(entry_request_id: nil).includes(guest: :request).find_each do |invite|
        invite.update!(entry_request_id: invite.guest.request.id)
      end
    end
  rescue StandardError => e
    puts 'Failed to update invite'
    puts e.message.to_s
  end
end
