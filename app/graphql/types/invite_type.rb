# frozen_string_literal: true

module Types
  # InviteType
  class InviteType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :host_id, ID, null: true
    field :entry_time, Types::EntryTimeType, null: true
    field :guest, Types::UserType, null: true
  end
end
