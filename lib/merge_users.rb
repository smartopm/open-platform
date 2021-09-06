# frozen_string_literal: true

require 'roo'

# rubocop:disable Metrics/ClassLength
# rubocop:disable Rails/SkipsModelValidations
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

    user = Users::User.find_by(id: user_id)
    duplicate_user = Users::User.find_by(id: duplicate_id)

    # Update PlanPayment user
    user.plan_payments.exluding_general_payments.update_all(user_id: duplicate_id)

    merge_accounts_and_general_payments(user, duplicate_user)
    raise StandardError, 'Update Failed' if Payments::PlanPayment.where(user_id: user_id).any?

    # Updates accounts details to their associated user's details
    duplicate_user.update_associated_accounts_details
    raise StandardError, 'Update Failed' if Properties::Account.where(user_id: user_id).any?

    # Merges wallet details of users.
    merge_user_wallets(user_id, duplicate_id)

    # Update showroom User
    showrooms = Showroom.where(userId: user_id)
    showrooms.each do |showroom|
      showroom.update(userId: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Showroom.where(userId: user_id).any?

    # Update author in Notes
    notes_auth = Notes::Note.where(author_id: user_id)
    notes_auth.each do |note|
      note.update(author_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Notes::Note.where(author_id: user_id).any?

    # Update sender in Messages
    message_senders = Notifications::Message.where(sender_id: user_id)
    message_senders.each do |message|
      message.update(sender_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Notifications::Message.where(sender_id: user_id).any?

    # Update grantor in Entry Request
    entry_request_grantors = Logs::EntryRequest.where(grantor_id: user_id)
    entry_request_grantors.each do |entry_request_grantor|
      entry_request_grantor.update(grantor_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Logs::EntryRequest.where(grantor_id: user_id).any?

    # Update acting user in Event Log
    event_logs = Logs::EventLog.where(acting_user_id: user_id)
    event_logs.each do |event_log|
      event_log.update(acting_user_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Logs::EventLog.where(acting_user_id: user_id).any?

    # Update user ref in Event Log
    refs = Logs::EventLog.where(ref_id: user_id, ref_type: 'Users::User')
    refs.each do |ref|
      ref.update(ref_id: duplicate_id)
    end

    # Update user in UserLabel
    user_labels = Labels::UserLabel.where(user_id: user_id)
    user_labels.each do |user_label|
      if Labels::UserLabel.exists?(user_id: duplicate_id, label_id: user_label.label_id)
        user_label.destroy
      else
        user_label.update(user_id: duplicate_id)
      end
    end

    # Update reporting_user_id in ActivityLog
    logs = Logs::ActivityLog.where(reporting_user_id: user_id)
    logs.each do |log|
      log.update(reporting_user_id: duplicate_id)
    end
    raise StandardError, 'Update Failed' if Logs::EventLog.where(acting_user_id: user_id).any?

    # Update status_updated_by_id in FormUser
    Forms::FormUser.where(status_updated_by_id: user_id)
                   .update_all(status_updated_by_id: duplicate_id)
    raise StandardError, 'Update Failed' if Forms::FormUser
                                            .where(status_updated_by_id: user_id).any?

    # Update depositor_id in Transaction
    Payments::Transaction.where(depositor_id: user_id).update_all(depositor_id: duplicate_id)
    raise StandardError, 'Update Failed' if Payments::Transaction.where(depositor_id: user_id).any?

    # Update sub_administrator_id in Community
    if user.community.sub_administrator_id.eql?(user_id)
      user.community.update(sub_administrator_id: duplicate_id)
      raise StandardError, 'Update Failed' if user.community.sub_administrator_id.eql?(user.id)
    end

    # Update PlanOwnerhip user
    plan_ownerships = Properties::PlanOwnership.where(user_id: user_id)
    plan_ownerships.each do |ownership|
      if duplicate_user.plan_ownerships.exists?(payment_plan_id: ownership.payment_plan_id) ||
         duplicate_user.payment_plans.exists?(id: ownership.payment_plan_id)
        ownership.destroy
      else
        ownership.update(user_id: duplicate_id)
      end
    end
    raise StandardError, 'Update Failed' if Properties::PlanOwnership.where(user_id: user_id).any?

    models_with_user_id.each do |table_name|
      next if table_name.constantize.where(user_id: user_id).empty?

      raise StandardError, 'Update Failed'
    end

    raise StandardError, 'Delete Failed' unless Users::User.find(user_id).delete
  end

  def self.merge_accounts_and_general_payments(user, duplicate_user)
    if user.land_parcels.unscope(where: :status).general.first.present?
      # Updates plan payments of general plan
      general_plan = duplicate_user.general_payment_plan
      user.general_payment_plan.plan_payments.update_all(user_id: duplicate_user.id,
                                                         payment_plan_id: general_plan.id)
      user.general_payment_plan.destroy!

      # Update accounts and destroy user general land parcel
      accounts = Properties::Account.where(user_id: user.id)
      general_land_parcel = user.general_land_parcel
      general_account = general_land_parcel.accounts.first
      accounts.where.not(id: general_account.id).update_all(user_id: duplicate_user.id)
      general_land_parcel.land_parcel_accounts.delete_all
      general_account.destroy!
      general_land_parcel.destroy!
    else
      accounts = Properties::Account.where(user_id: user.id)
      accounts.update_all(user_id: duplicate_user.id)
    end
  end

  # Returns model names(including namespace models) which consist user_id.
  #
  # @return [Array] Model name (with/without namespace).
  def self.models_with_user_id
    model_names = []
    payment_models = %w[Invoice PaymentInvoice Payment Wallet WalletTransaction
                        Transaction]
    property_models = %w[PaymentPlan Valuation]
    note_models = %w[Note NoteHistory AssigneeNote]
    form_models = %w[FormUser UserFormProperty]
    discussion_models = %w[Discussion DiscussionUser]
    comment_models = %w[Comment NoteComment]
    log_models = %w[ActivityLog EventLog ImportLog SubstatusLog EntryRequest]
    notification_models = %w[EmailTemplate Message Notification]
    user_models = %w[ContactInfo Feedback ActivityPoint TimeSheet]
    post_tag_models = %w[PostTagUser]
    ActiveRecord::Base.connection.tables.map(&:classify).each do |class_name|
      model_name = case class_name
                   when *payment_models then "Payments::#{class_name}"
                   when *property_models then "Properties::#{class_name}"
                   when *note_models then "Notes::#{class_name}"
                   when *form_models then "Forms::#{class_name}"
                   when *discussion_models then "Discussions::#{class_name}"
                   when *comment_models then "Comments::#{class_name}"
                   when *log_models then "Logs::#{class_name}"
                   when *notification_models then "Notifications::#{class_name}"
                   when *user_models then "Users::#{class_name}"
                   when *post_tag_models then "PostTags::#{class_name}"
                   else
                     class_name
                   end
      model_names << model_name if model_name.constantize.column_names.include?('user_id')
    rescue StandardError
      nil
    end
    model_names.compact - %w[Labels::UserLabel Logs::ActivityLog Payments::Wallet]
  end

  # Merges wallet details of users.
  #
  # @param user_id [String]
  # @param duplicate_user_id [String]
  #
  # @return [void]
  def self.merge_user_wallets(user_id, duplicate_user_id)
    wallet = Users::User.find_by(id: user_id)&.wallet
    duplicate_wallet = Users::User.find_by(id: duplicate_user_id)&.wallet

    duplicate_wallet.balance += wallet.balance
    duplicate_wallet.pending_balance += wallet.pending_balance
    duplicate_wallet.unallocated_funds += wallet.unallocated_funds
    duplicate_wallet.save!
    wallet.destroy!
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity
end
# rubocop:enable Metrics/ClassLength
# rubocop:enable Rails/SkipsModelValidations
