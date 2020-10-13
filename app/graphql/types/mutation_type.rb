# frozen_string_literal: true

module Types
  # MutationType
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

    # User login
    field :login_phone_start, mutation: Mutations::Login::LoginPhoneStart
    field :login_phone_complete, mutation: Mutations::Login::LoginPhoneComplete
    field :login_switch_user, mutation: Mutations::Login::LoginSwitchUser

    # Notes
    field :note_create, mutation: Mutations::Note::NoteCreate
    field :note_update, mutation: Mutations::Note::NoteUpdate
    field :note_assign, mutation: Mutations::Note::NoteAssign
    field :note_comment_create, mutation: Mutations::Note::NoteCommentCreate
    field :note_comment_update, mutation: Mutations::Note::NoteCommentUpdate
    field :note_comment_delete, mutation: Mutations::Note::NoteCommentDelete

    # Feedback
    field :feedback_create, mutation: Mutations::Feedback::FeedbackCreate

    # showroom
    field :showroom_entry_create, mutation: Mutations::Showroom::ShowroomCreate

    # messages
    field :message_create, mutation: Mutations::Message::MessageCreate

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
    field :discussion_user_create, mutation: Mutations::Discussion::DiscussionUserCreate

    # labels
    field :label_create, mutation: Mutations::Label::LabelCreate
    field :label_update, mutation: Mutations::Label::LabelUpdate
    field :label_delete, mutation: Mutations::Label::LabelDelete
    field :user_label_create, mutation: Mutations::Label::UserLabelCreate
    field :user_label_update, mutation: Mutations::Label::UserLabelUpdate

    # notifications
    field :notification_preference, mutation: Mutations::Settings::NotificationPreference

    # businesses
    field :business_create, mutation: Mutations::Business::BusinessCreate
    # Businesses
    field :business_delete, mutation: Mutations::Business::BusinessDelete

    # posts
    field :log_read_post, mutation: Mutations::Post::LogReadPost
    field :log_shared_post, mutation: Mutations::Post::LogSharedPost
  end
end
