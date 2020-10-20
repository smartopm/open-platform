# frozen_string_literal: true

module Types
  # UserFormPropertiesType
  class UserFormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :form_property, Types::FormPropertiesType, null: false
    field :form_user_id, Types::FormUsersType, null: false
    field :user, Types::UserType, null: false
    field :value, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
