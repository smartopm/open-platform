# frozen_string_literal: true

namespace :db do
  desc 'Add community to forms'
  task add_community_to_time_sheets: :environment do
    ActiveRecord::Base.transaction do
      Users::TimeSheet.all.each do |time_sheet|
        community_id = time_sheet.user.community_id
        time_sheet.update!(community_id: community_id)
      end
    end
  rescue StandardError => e
    puts 'Failed to add community'
    puts e.message.to_s
  end
end
