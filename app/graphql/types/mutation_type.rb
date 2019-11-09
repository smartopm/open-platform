# frozen_string_literal: true

module Types
  # MutationType
  class MutationType < Types::BaseObject
    field :activity_log_add, mutation: Mutations::ActivityLog::Add
    field :user_create, mutation: Mutations::User::Create
    field :user_update, mutation: Mutations::User::Update
    field :one_time_login, mutation: Mutations::User::OneTimeLogin
    field :create_upload, mutation: Mutations::Upload::CreateAttachment
  end
end
