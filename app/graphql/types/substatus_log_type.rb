# frozen_string_literal: true

module Types
  # SubStatus Log Type
  class SubstatusLogType < Types::BaseObject
    field :id, ID, null: true
    field :user_id, ID, null: false
    field :start_date, Types::Scalar::DateType, null: true
    field :stop_date, Types::Scalar::DateType, null: true
    field :new_status, String, null: true
    field :previous_status, String, null: true
    field :created_at, Types::Scalar::DateType, null: true
  end
end
