# frozen_string_literal: true

module Types
  # UserLabelType
  class UserLabelType < Types::BaseObject
    field :id, ID, null: false
    field :label_id, ID, null: false
    field :user_id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
