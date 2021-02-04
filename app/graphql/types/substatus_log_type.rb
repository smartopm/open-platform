# frozen_string_literal: true

module Types
  # SubStatus Log Type
  class SubstatusLogType < Types::BaseObject
    field :start_date, GraphQL::Types::ISO8601DateTime, null: true
    field :stop_date, GraphQL::Types::ISO8601DateTime, null: true
    field :new_status, String, null: true
    field :previous_status, String, null: true
  end
end
