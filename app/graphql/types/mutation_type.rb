# frozen_string_literal: true

module Types
  # MutationType
  class MutationType < Types::BaseObject
    field :activity_log_add, mutation: Mutations::ActivityLog::Add
    field :user_create_pending, mutation: Mutations::User::CreatePending
    field :user_update_pending, mutation: Mutations::User::UpdatePending
    field :user_create, mutation: Mutations::User::Create
    field :user_update, mutation: Mutations::User::Update
  end
end
