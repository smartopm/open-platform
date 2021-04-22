# frozen_string_literal: true

desc 'update Existing event logs ref type with namespace columns'
# rubocop:disable Metrics/BlockLength
task update_event_logs_ref_type: :environment do
  comment_models = %w[Comment NoteComment]
  discussion_models = %w[Discussion DiscussionUser]
  form_models = %w[Form FormProperty FormUser UserFormProperty]
  label_models = %w[CampaignLabel Label UserLabel]
  log_models = %w[ActivityLog EntryRequest ImportLog SubstatusLog]
  note_models = %w[AssigneeNote Note NoteHistory]
  notification_models = %w[EmailTemplate Message Notification]
  payment_models = %w[Invoice Payment PaymentInvoice Wallet WalletTransaction]
  post_tag_models = %w[PostTag PostTagUser]
  property_models = %w[Account LandParcel LandParcelAccount PaymentPlan Valuation]
  user_models = %w[ActivityPoint ContactInfo Feedback TimeSheet User]

  Logs::EventLog.all.each do |event_log|
    ref_type = event_log.ref_type
    model_name = case event_log.ref_type
                 when *comment_models then "Comments::#{ref_type}"
                 when *discussion_models then "Discussions::#{ref_type}"
                 when *form_models then "Forms::#{ref_type}"
                 when *label_models then "Labels::#{ref_type}"
                 when *log_models then "Logs::#{ref_type}"
                 when *note_models then "Notes::#{ref_type}"
                 when *notification_models then "Notifications::#{ref_type}"
                 when *payment_models then "Payments::#{ref_type}"
                 when *post_tag_models then "PostTags::#{ref_type}"
                 when *property_models then "Properties::#{ref_type}"
                 when *user_models then "Users::#{ref_type}"
                 when 'ActionFlow' then 'ActionFlows::ActionFlow'
                 else
                   ref_type
                 end
    # rubocop:disable Rails/SkipsModelValidations
    event_log.update_column(:ref_type, model_name)
    # rubocop:enable Rails/SkipsModelValidations
    # rubocop:enable Metrics/BlockLength
  end
end
