# frozen_string_literal: true

module Types
  # PostTagUser
  class PostTagUserType < Types::BaseObject
    field :id, ID, null: false
    field :post_tag_id, ID, null: false
    field :user_id, ID, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end
