# frozen_string_literal: true

module Types
  # LabelType
  class LabelType < Types::BaseObject
    field :id, ID, null: false
    field :short_desc, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
