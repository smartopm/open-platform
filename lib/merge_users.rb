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
    # Update showroom User
    showrooms = Showroom.where(userId: user_id)
    showrooms.each do |showroom|
      showroom.update(userId: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Showroom.where(userId: user_id).any?

    # Update user in notes
    notes = Note.where(user_id: user_id)
    notes.each do |note|
      note.update(user_id: duplicate_id)
    end

    # Update author in Notes
    notes_auth = Note.where(author_id: user_id)
    notes_auth.each do |note|
      note.update(author_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Note.where(author_id: user_id).any?

    # Update assignee in Notes
    assignees = AssigneeNote.where(user_id: user_id)
    assignees.each do |assignee|
      assignee.update(user_id: duplicate_id)
    end

    # Update user in Business
    businesses = Business.where(user_id: user_id)
    businesses.each do |business|
      business.update(user_id: duplicate_id)
    end

    # Update user in Comment
    comments = Comment.where(user_id: user_id)
    comments.each do |comment|
      comment.update(user_id: duplicate_id)
    end

    # Update user in ContactInfo
    contact_infos = ContactInfo.where(user_id: user_id)
    contact_infos.each do |contact_info|
      contact_info.update(user_id: duplicate_id)
    end

    # Update user in Discussion
    discussions = Discussion.where(user_id: user_id)
    discussions.each do |discussion|
      discussion.update(user_id: duplicate_id)
    end

    # Update user in DiscussionUser
    discussion_users = DiscussionUser.where(user_id: user_id)
    discussion_users.each do |discussion_user|
      discussion_user.update(user_id: duplicate_id)
    end

    # Update user in Messages
    messages = Message.where(user_id: user_id)
    messages.each do |message|
      message.update(user_id: duplicate_id)
    end

    # Update sender in Messages
    message_senders = Message.where(sender_id: user_id)
    message_senders.each do |message|
      message.update(sender_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Message.where(sender_id: user_id).any?

    # Update sender in Feedback
    feedbacks = Feedback.where(user_id: user_id)
    feedbacks.each do |feedback|
      feedback.update(user_id: duplicate_id)
    end

    # Update user in Entry Request
    entry_requests = EntryRequest.where(user_id: user_id)
    entry_requests.each do |entry_request|
      entry_request.update(user_id: duplicate_id)
    end

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

    # Update user in Accounts
    accounts = Account.where(user_id: user_id)
    accounts.each do |account|
      account.update(user_id: duplicate_id)
    end

    # Update user in TimeSheet
    time_sheets = TimeSheet.where(user_id: user_id)
    time_sheets.each do |time_sheet|
      time_sheet.update(user_id: duplicate_id)
    end

    # Update user in UserLabel
    user_labels = UserLabel.where(user_id: user_id)
    user_labels.each do |user_label|
      user_label.update(user_id: duplicate_id)
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

    %w[Note Message Feedback EntryRequest Account TimeSheet UserLabel].each do |table_name|
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
