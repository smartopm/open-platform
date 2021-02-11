# frozen_string_literal: true

desc 'sync user data with substatus_logs'
namespace :db do
  task sync_users_with_substatus_logs: :environment do
    puts 'Will sync data in users table with substatus_logs table'

    community = Community.find_by(name: 'Nkwashi')

    community.present? && community.users.each do |u|
      existing_substatus_log = SubstatusLog.where(user_id: u[:id]).order(created_at: :desc)&.first

      if existing_substatus_log.present?
        puts "skipped for user with id: #{u[:id]}. Substatus Log already exists"
        next
      end

      new_substatus_log = SubstatusLog.create!(
        new_status: u[:sub_status],
        start_date: u[:updated_at].to_datetime.in_time_zone('Africa/Lusaka'),
        user_id: u[:id],
        community_id: u[:community_id],
        previous_status: nil,
        stop_date: nil,
      )

      if new_substatus_log.present?
        u.update!(latest_substatus_id: new_substatus_log[:id])
        puts "sync successful for user with id #{u[:id]}."
      end
    end

    puts "Done. #{community.users.count} total."
  end
end
