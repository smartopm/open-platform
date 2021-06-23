# frozen_string_literal: true

module Types
  # FormType
  class FormType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :status, String, null: false
    field :description, String, null: false
    field :community, Types::CommunityType, null: false
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
