# frozen_string_literal: true

module Types
    # CommentType
    class CommentType < Types::BaseObject
      field :id, ID, null: false
      field :user_id, ID, null: false
      field :post_id, String, null: false
      field :content, String, null: true
      field :user, Types::UserType, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end
  