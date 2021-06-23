# frozen_string_literal: true

module Types
  # DiscussionType
  class DiscussionType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :post_id, String, null: true
    field :title, String, null: true
    field :description, String, null: true
    field :user, Types::UserType, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end
