# frozen_string_literal: true

require 'roo'

# Script to read from spreadsheet and merge duplicate users
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
    models_with_user_id.each do |table_name|
      table_name.constantize.where(user_id: user_id).update(user_id: duplicate_id)

      raise StandardError, 'Update Failed' if table_name.constantize.where(user_id: user_id).any?
    end
    # Merges wallet details of users.
    merge_user_wallets(user_id, duplicate_id)

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
      if UserLabel.exists?(user_id: duplicate_id, label_id: user_label.label_id)
        user_label.destroy
      else
        user_label.update(user_id: duplicate_id)
      end
    end

    # Update reporting_user_id in ActivityLog
    logs = ActivityLog.where(reporting_user_id: user_id)
    logs.each do |log|
      log.update(reporting_user_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if EventLog.where(acting_user_id: user_id).any?

    models_with_user_id.each do |table_name|
      next if table_name.constantize.where(user_id: user_id).empty?

      raise StandardError, 'Update Failed'
    end

    raise StandardError, 'Delete Failed' unless User.find(user_id).delete
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def self.models_with_user_id
    ActiveRecord::Base.connection.tables.select do |table|
      table.classify.constantize.column_names.include?('user_id')
    rescue StandardError
      nil
    end.compact.map(&:classify) - %w[UserLabel ActivityLog Wallet]
  end

  # Merges wallet details of users.
  #
  # @param user_id [String]
  # @param duplicate_user_id [String]
  #
  # @return [void]
  def self.merge_user_wallets(user_id, duplicate_user_id)
    wallet = User.find_by(id: user_id)&.wallet
    duplicate_wallet = User.find_by(id: duplicate_user_id)&.wallet

    duplicate_wallet.balance += wallet.balance
    duplicate_wallet.pending_balance += wallet.pending_balance
    duplicate_wallet.unallocated_funds += wallet.unallocated_funds
    duplicate_wallet.save!
    wallet.destroy!
  end
end
