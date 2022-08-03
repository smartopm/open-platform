# frozen_string_literal: true

module Types
  # business type
  class BusinessType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :name, String, null: false
    field :email, String, null: true
    field :phone_number, String, null: false
    field :address, String, null: true
    field :status, String, null: true
    field :operation_hours, String, null: true
    field :home_url, String, null: true
    field :category, String, null: true
    field :image_url, String, null: true
    field :description, String, null: true
    field :links, GraphQL::Types::JSON, null: true
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
