# frozen_string_literal: true

module Types
  # EntryTimeType
  class EntryTimeType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :visitation_date, GraphQL::Types::ISO8601DateTime, null: true
    field :visit_end_date, GraphQL::Types::ISO8601DateTime, null: true
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: true
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: true
    field :occurs_on, [String], null: true
    field :visitable_id, ID, null: true
    field :visitable_type, String, null: true
  end
end
