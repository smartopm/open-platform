# frozen_string_literal: true

module Types
  # MutationType
  class MutationType < Types::BaseObject
    field :activity_log_add, mutation: Mutations::ActivityLog::Add
    field :activity_log_update_log, mutation: Mutations::ActivityLog::UpdateLog
    field :user_create, mutation: Mutations::User::Create
    field :user_update, mutation: Mutations::User::Update
    field :user_delete, mutation: Mutations::User::Delete
    field :one_time_login, mutation: Mutations::User::OneTimeLogin
    field :create_upload, mutation: Mutations::Upload::CreateAttachment

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
  end
end
