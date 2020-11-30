# frozen_string_literal: true

module Types
  # post_tag Type
  class PostTagType < Types::BaseObject
    field :id, ID, null: false
    field :community_id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
