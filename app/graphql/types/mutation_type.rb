# frozen_string_literal: true

module Types
  # MutationType
  # rubocop: disable Metrics/ClassLength
  class MutationType < Types::BaseObject
    field :activity_log_add, mutation: Mutations::ActivityLog::Add
    field :activity_log_update_log, mutation: Mutations::ActivityLog::UpdateLog
    field :user_create, mutation: Mutations::User::Create
    field :user_update, mutation: Mutations::User::Update
    field :one_time_login, mutation: Mutations::User::OneTimeLogin
    field :user_merge, mutation: Mutations::User::Merge
    field :create_upload, mutation: Mutations::Upload::CreateAttachment
    field :users_import, mutation: Mutations::User::Import

    # Entry Requests
    field :entry_request_create, mutation: Mutations::EntryRequest::EntryRequestCreate
    field :entry_request_update, mutation: Mutations::EntryRequest::EntryRequestUpdate
    field :entry_request_grant, mutation: Mutations::EntryRequest::EntryRequestGrant
    field :entry_request_deny, mutation: Mutations::EntryRequest::EntryRequestDeny
    field :entry_request_acknowledge, mutation: Mutations::EntryRequest::EntryRequestAcknowledge
    field :entry_request_note, mutation: Mutations::EntryRequest::EntryRequestNote
    field :invitation_create, mutation: Mutations::EntryRequest::InvitationCreate
    field :send_guest_qr_code, mutation: Mutations::EntryRequest::SendQrCode
    field :guest_entry_request_revoke, mutation: Mutations::EntryRequest::GuestEntryRequestRevoke
    field :invitation_update, mutation: Mutations::EntryRequest::InvitationUpdate

    # User login
    field :login_phone_start, mutation: Mutations::Login::LoginPhoneStart
    field :login_phone_complete, mutation: Mutations::Login::LoginPhoneComplete
    field :login_switch_user, mutation: Mutations::Login::LoginSwitchUser
    field :login_email, mutation: Mutations::Login::LoginEmail
    field :login_public_user, mutation: Mutations::Login::LoginPublicUser

    # Notes
    field :note_create, mutation: Mutations::Note::NoteCreate
    field :task_list_create, mutation: Mutations::Note::TaskListCreate
    field :note_update, mutation: Mutations::Note::NoteUpdate
    field :note_assign, mutation: Mutations::Note::NoteAssign
    field :note_comment_create, mutation: Mutations::Note::NoteCommentCreate
    field :note_comment_update, mutation: Mutations::Note::NoteCommentUpdate
    field :note_comment_delete, mutation: Mutations::Note::NoteCommentDelete
    field :note_bulk_update, mutation: Mutations::Note::NoteBulkUpdate
    field :set_note_reminder, mutation: Mutations::Note::SetNoteReminder
    field :note_document_delete, mutation: Mutations::Note::NoteDocumentDelete
    field :note_comments_resolve, mutation: Mutations::Note::NoteCommentsResolve
    field :note_list_update, mutation: Mutations::Note::NoteListUpdate
    field :note_list_delete, mutation: Mutations::Note::NoteListDelete
    field :note_delete, mutation: Mutations::Note::NoteDelete

    # Process
    field :process_update, mutation: Mutations::Process::ProcessUpdate

    # Feedback
    field :feedback_create, mutation: Mutations::Feedback::FeedbackCreate

    # showroom
    field :showroom_entry_create, mutation: Mutations::Showroom::ShowroomCreate

    # messages
    field :message_create, mutation: Mutations::Message::MessageCreate
    field :message_notification_update, mutation: Mutations::Message::MessageNotificationUpdate

    # temperature capture
    field :temperature_update, mutation: Mutations::Temperature::TemperatureUpdate

    # track time
    field :manage_shift, mutation: Mutations::Timesheet::ManageShift

    # campaigns
    field :campaign_create, mutation: Mutations::Campaign::CampaignCreate
    field :campaign_update, mutation: Mutations::Campaign::CampaignUpdate
    field :campaign_delete, mutation: Mutations::Campaign::CampaignDelete
    field :campaign_create_through_users, mutation: Mutations::Campaign::CampaignCreateThroughUsers
    field :campaign_label_remove, mutation: Mutations::Campaign::CampaignLabelRemove

    # comments
    field :comment_create, mutation: Mutations::Comment::CommentCreate
    field :comment_update, mutation: Mutations::Comment::CommentUpdate

    # discussions
    field :discussion_create, mutation: Mutations::Discussion::DiscussionCreate
    field :discussion_update, mutation: Mutations::Discussion::DiscussionUpdate
    field :discussion_user_create, mutation: Mutations::Discussion::DiscussionUserCreate
    field :post_create, mutation: Mutations::Discussion::PostCreate
    field :post_image_delete, mutation: Mutations::Discussion::PostImageDelete
    field :post_update, mutation: Mutations::Discussion::PostUpdate
    field :post_delete, mutation: Mutations::Discussion::PostDelete

    # labels
    field :label_create, mutation: Mutations::Label::LabelCreate
    field :label_update, mutation: Mutations::Label::LabelUpdate
    field :label_delete, mutation: Mutations::Label::LabelDelete
    field :user_label_create, mutation: Mutations::Label::UserLabelCreate
    field :user_label_update, mutation: Mutations::Label::UserLabelUpdate
    field :label_merge, mutation: Mutations::Label::LabelMerge

    # notifications
    field :notification_preference, mutation: Mutations::Settings::NotificationPreference
    field :notification_update, mutation: Mutations::Notification::NotificationUpdate

    # businesses
    field :business_create, mutation: Mutations::Business::BusinessCreate
    field :business_delete, mutation: Mutations::Business::BusinessDelete
    field :business_update, mutation: Mutations::Business::BusinessUpdate

    # posts
    field :log_read_post, mutation: Mutations::Post::LogReadPost
    field :log_shared_post, mutation: Mutations::Post::LogSharedPost
    field :follow_post_tag, mutation: Mutations::Post::FollowPostTag

    # forms
    field :category_create, mutation: Mutations::Form::CategoryCreate
    field :category_delete, mutation: Mutations::Form::CategoryDelete
    field :category_update, mutation: Mutations::Form::CategoryUpdate
    field :form_create, mutation: Mutations::Form::FormCreate
    field :form_update, mutation: Mutations::Form::FormUpdate
    field :form_properties_create, mutation: Mutations::Form::FormPropertiesCreate
    field :form_properties_update, mutation: Mutations::Form::FormPropertiesUpdate
    field :form_properties_delete, mutation: Mutations::Form::FormPropertiesDelete
    field :form_user_create, mutation: Mutations::Form::FormUserCreate
    field :form_user_update, mutation: Mutations::Form::FormUserUpdate
    field :form_user_status_update, mutation: Mutations::Form::FormUserStatusUpdate
    field :user_form_properties_create, mutation: Mutations::Form::UserFormPropertiesCreate
    field :user_form_properties_update, mutation: Mutations::Form::UserFormPropertiesUpdate

    # land_parcel
    field :PropertyCreate, mutation: Mutations::LandParcel::PropertyCreate
    field :property_update, mutation: Mutations::LandParcel::PropertyUpdate
    field :property_merge, mutation: Mutations::LandParcel::PropertyMerge
    field :point_of_interest_create, mutation: Mutations::LandParcel::PointOfInterestCreate
    field :point_of_interest_update, mutation: Mutations::LandParcel::PointOfInterestUpdate
    field :point_of_interest_delete, mutation: Mutations::LandParcel::PointOfInterestDelete
    field :poi_image_upload, mutation: Mutations::LandParcel::PointOfInterestImageCreate

    # action_flow
    field :action_flow_create, mutation: Mutations::ActionFlow::ActionFlowCreate
    field :action_flow_update, mutation: Mutations::ActionFlow::ActionFlowUpdate
    field :action_flow_delete, mutation: Mutations::ActionFlow::ActionFlowDelete

    # community
    field :community_update, mutation: Mutations::Community::CommunityUpdate
    field :community_emergency, mutation: Mutations::Community::CommunityEmergency
    field :community_emergency_cancel, mutation: Mutations::Community::CommunityEmergencyCancel

    # contact_info
    field :contact_info_delete, mutation: Mutations::ContactInfo::Delete

    # invoice
    field :invoice_create, mutation: Mutations::Invoice::InvoiceCreate
    field :invoice_cancel, mutation: Mutations::Invoice::InvoiceCancel

    # payments
    field :plan_payment_cancel, mutation: Mutations::Payment::PlanPaymentCancel
    field :plan_payment_create, mutation: Mutations::Payment::PlanPaymentCreate
    field :transfer_plan_payment, mutation: Mutations::Payment::TransferPlanPayment

    # payment_plan
    field :payment_plan_create, mutation: Mutations::PaymentPlan::PaymentPlanCreate
    field :payment_plan_cancel, mutation: Mutations::PaymentPlan::PaymentPlanCancel
    field :payment_plan_update, mutation: Mutations::PaymentPlan::PaymentPlanUpdate
    field :transfer_payment_plan, mutation: Mutations::PaymentPlan::TransferPaymentPlan
    field :payment_reminder_create, mutation: Mutations::PaymentPlan::PaymentReminderCreate
    field :allocate_general_funds, mutation: Mutations::PaymentPlan::AllocateGeneralFunds

    # subscription_plan
    field :subscription_plan_create, mutation: Mutations::SubscriptionPlan::SubscriptionPlanCreate
    field :subscription_plan_update, mutation: Mutations::SubscriptionPlan::SubscriptionPlanUpdate

    # transactions
    field :wallet_transaction_create, mutation: Mutations::Transaction::WalletTransactionCreate
    field :wallet_transaction_update, mutation: Mutations::Transaction::WalletTransactionUpdate
    field :wallet_transaction_revert, mutation: Mutations::Transaction::WalletTransactionRevert
    field :transaction_create, mutation: Mutations::Transaction::TransactionCreate
    field :transaction_revert, mutation: Mutations::Transaction::TransactionRevert

    # transaction_log
    field :transaction_log_create, mutation: Mutations::TransactionLog::TransactionLogCreate

    # email_template
    field :email_template_create, mutation: Mutations::EmailTemplate::TemplateCreate
    field :email_template_update, mutation: Mutations::EmailTemplate::TemplateUpdate

    # substatus_logs
    field :substatus_log_update, mutation: Mutations::SubstatusLog::SubstatusLogUpdate

    # process
    field :process_create, mutation: Mutations::Process::ProcessCreate
    field :process_delete, mutation: Mutations::Process::ProcessDelete

    # lead logs
    field :lead_log_create, mutation: Mutations::Log::LeadLogCreate
    field :lead_log_update, mutation: Mutations::Log::LeadLogUpdate

    # amenity
    field :amenity_create, mutation: Mutations::Amenity::AmenityCreate
    field :amenity_update, mutation: Mutations::Amenity::AmenityUpdate
    field :amenity_delete, mutation: Mutations::Amenity::AmenityDelete

    # flutterwave
    field :transaction_initiate, mutation: Mutations::Flutterwave::TransactionInitiate
    field :transaction_verify, mutation: Mutations::Flutterwave::TransactionVerify
  end
  # rubocop: enable Metrics/ClassLength
end
