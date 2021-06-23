# frozen_string_literal: true

module Types
  # UserPointType
  class UserPointType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :article_read, Integer, null: false
    field :article_shared, Integer, null: false
    field :comment, Integer, null: false
    field :referral, Integer, null: false
    field :login, Integer, null: false
    field :total, Integer, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end
