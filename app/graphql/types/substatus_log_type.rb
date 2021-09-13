# frozen_string_literal: true

module Types
  # SubStatus Log Type
  class SubstatusLogType < Types::BaseObject
    field :id, ID, null: true
    field :user_id, ID, null: false
    field :updated_by, Types::UserType, null: true # Backfill data?
    field :start_date, GraphQL::Types::ISO8601DateTime, null: true
    field :stop_date, GraphQL::Types::ISO8601DateTime, null: true
    field :new_status, String, null: true
    field :previous_status, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
