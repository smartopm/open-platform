# frozen_string_literal: true

namespace :db do
  desc 'Update missing ref type and ref id of user login event logs'
  task update_missing_ref_type_of_user_login_event_logs: :environment do
    ActiveRecord::Base.transaction do
      event_logs = Logs::EventLog.where(subject: 'user_login')
      event_logs.where('ref_type is null or ref_id is null').each do |event_log|
        event_log.ref_type = 'Users::User'
        event_log.ref_id = event_log.acting_user_id
        log_update = event_log.save
        if log_update
          puts "ref_type and ref_id updated for event log with id #{event_log.id}"
        else
          puts "Failed to update ref_type and ref_id for event log with id #{event_log.id}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
