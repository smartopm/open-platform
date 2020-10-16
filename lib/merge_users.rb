# frozen_string_literal: true

require 'roo'

# Script to read from spreadsheet and merge duplicate users
# rubocop:disable Metrics/ClassLength
class MergeUsers
  def self.batch_merge_from_file(path)
    cleanup_file = Roo::Spreadsheet.open(path)
    script_input = cleanup_file.sheet(0).drop(1)
    Rails.application.load_tasks
    script_input.each do |user_id, merge_to_id|
      merge(user_id, merge_to_id)
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  def self.merge(user_id, duplicate_id)
    %w[ActivityPoint AssigneeNote Business Account Comment ContactInfo
       DiscussionUser Discussion EntryRequest Feedback FormUser Message
       NoteComment NoteHistory Note TimeSheet UserFormProperty].each do |table_name|
      table_name.constantize.where(user_id: user_id).update(user_id: duplicate_id)

      raise StandardError, 'Update Failed' if table_name.constantize.where(user_id: user_id).any?
    end
  
    # Update showroom User
    showrooms = Showroom.where(userId: user_id)
    showrooms.each do |showroom|
      showroom.update(userId: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Showroom.where(userId: user_id).any?

    # Update author in Notes
    notes_auth = Note.where(author_id: user_id)
    notes_auth.each do |note|
      note.update(author_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Note.where(author_id: user_id).any?

    # Update sender in Messages
    message_senders = Message.where(sender_id: user_id)
    message_senders.each do |message|
      message.update(sender_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Message.where(sender_id: user_id).any?

    # Update grantor in Entry Request
    entry_request_grantors = EntryRequest.where(grantor_id: user_id)
    entry_request_grantors.each do |entry_request_grantor|
      entry_request_grantor.update(grantor_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if EntryRequest.where(grantor_id: user_id).any?

    # Update acting user in Event Log
    event_logs = EventLog.where(acting_user_id: user_id)
    event_logs.each do |event_log|
      event_log.update(acting_user_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if EventLog.where(acting_user_id: user_id).any?

    # Update user ref in Event Log
    refs = EventLog.where(ref_id: user_id, ref_type: 'user')
    refs.each do |ref|
      ref.update(ref_id: duplicate_id)
    end

    # Update user in UserLabel
    user_labels = UserLabel.where(user_id: user_id)
    user_labels.each do |user_label|
      if UserLabel.exists?(user_id: duplicate_id)
        user_label.destroy
      else
        user_label.update(user_id: duplicate_id)
      end
    end

    # Update user in ActivityLog
    # rubocop:disable Metrics/LineLength
    update_user = "UPDATE activity_logs SET user_id = '#{duplicate_id}' WHERE user_id = '#{user_id}'"
    ActiveRecord::Base.connection.exec_query(update_user)
    find_logs_query = "SELECT * FROM activity_logs WHERE user_id = '#{user_id}'"
    logs_by_user = Array(ActiveRecord::Base.connection.exec_query(find_logs_query))
    raise StandardError, 'Update Failed' if logs_by_user.any?

    # Update reporting_user_id in ActivityLog
    update_reporting_user = "UPDATE activity_logs SET reporting_user_id = '#{duplicate_id}' WHERE
                            reporting_user_id = '#{user_id}'"
    ActiveRecord::Base.connection.exec_query(update_reporting_user)
    find_logs_query = "SELECT * FROM activity_logs WHERE user_id = '#{user_id}'"
    logs_by_reporting_user = Array(ActiveRecord::Base.connection.exec_query(find_logs_query))
    raise StandardError, 'Update Failed' if logs_by_reporting_user.any?

    # rubocop:enable Metrics/LineLength

    %w[ActivityPoint AssigneeNote Business Account Comment ContactInfo
       DiscussionUser Discussion EntryRequest Feedback FormUser Message
       NoteComment NoteHistory Note TimeSheet UserFormProperty].each do |table_name|
      next if table_name.constantize.where(user_id: user_id).empty?

      raise StandardError, 'Update Failed'
    end

    raise StandardError, 'Delete Failed' unless User.find(user_id).delete
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity
end
# rubocop:enable Metrics/ClassLength
