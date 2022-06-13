# frozen_string_literal: true

module Types
  # FormType
  class FormType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :status, String, null: false
    field :preview, Boolean, null: true
    field :is_public, Boolean, null: true
    field :description, String, null: false
    field :version_number, Integer, null: false
    field :community, Types::CommunityType, null: false
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :multiple_submissions_allowed, Boolean, null: true
    field :has_terms_and_conditions, Boolean, null: true
    field :roles, [String], null: true
  end
end
