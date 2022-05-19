# frozen_string_literal: true

module Types
  # FormType
  class FormUsersType < Types::BaseObject
    field :id, ID, null: false
    field :form_id, ID, null: false
    field :user_id, ID, null: false
    field :user, Types::UserType, null: false
    field :form, Types::FormType, null: true
    field :status, String, null: true
    field :has_agreed_to_terms, Boolean, null: true
    field :status_updated_by, Types::UserType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
