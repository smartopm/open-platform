# frozen_string_literal: true

module Types
  # ContactInfoType
  class ContactInfoType < Types::BaseObject
    field :id, ID, null: false
    field :contact_type, String, null: false
    field :info, String, null: false
    field :user, Types::UserType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
