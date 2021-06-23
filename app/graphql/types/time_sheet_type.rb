# frozen_string_literal: true

module Types
  # TimeSheet Type
  class TimeSheetType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :user_id, ID, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :started_at, Types::Scalar::DateType, null: true
    field :ended_at, Types::Scalar::DateType, null: true
  end
end
