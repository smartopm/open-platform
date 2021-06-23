# frozen_string_literal: true

module Types
  # Message Type
  class MessageType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :sender, Types::UserType, null: false
    field :user_id, ID, null: false
    field :sender_id, ID, null: false
    field :receiver, String, null: false
    field :status, String, null: false
    field :category, String, null: true
    field :message, String, null: true
    field :is_read, Boolean, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :read_at, Types::Scalar::DateType, null: true
  end
end
