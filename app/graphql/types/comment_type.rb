# frozen_string_literal: true

module Types
    # CommentType
    class CommentType < Types::BaseObject
      field :id, ID, null: false
      field :user_id, ID, null: false
      field :post_id, ID, null: false
      field :comment, String, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end
  