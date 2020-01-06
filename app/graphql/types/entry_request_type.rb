# frozen_string_literal: true

module Types
  # EntryRequestType
  class EntryRequestType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :grantor, Types::UserType, null: true
    field :name, String, null: true
    field :nrc, String, null: true
    field :phone_number, String, null: true
    field :vehicle_plate, String, null: true
    field :reason, String, null: true
    field :other_reason, String, null: true
    field :subject, String, null: true
    field :concern_flag, GraphQL::Types::Boolean, null: true
    field :granted_state, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :granted_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
