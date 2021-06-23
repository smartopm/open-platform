# frozen_string_literal: true

module Types
  # DiscussionUserType
  class DiscussionUserType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :discussion_id, ID, null: false
    field :user, Types::UserType, null: false
    field :discussion, Types::UserType, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end
