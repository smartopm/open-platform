# frozen_string_literal: true

module Types
    # PostTagUser
    class PostTagUserType < Types::BaseObject
      field :id, ID, null: false
      field :post_tag_id, ID, null: false
      field :user_id, ID, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
end
  