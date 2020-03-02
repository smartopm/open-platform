# frozen_string_literal: true

module Types
  # Showroom Type
  class ShowroomType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :name, String, null: false
    field :email, String, null: true
    field :phone_number, String, null: true
    field :home_address, String, null: true
    field :nrc, String, null: true
    field :reason, String, null: true
    field :source, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
