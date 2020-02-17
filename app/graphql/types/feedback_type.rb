# frozen_string_literal: true

module Types
  # Feedback Type
  class FeedbackType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :user_id, ID, null: false
    field :is_thumbs_up, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
