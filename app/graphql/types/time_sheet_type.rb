# frozen_string_literal: true

module Types
  # TimeSheet Type
  class TimeSheetType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :user_id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :started_at, GraphQL::Types::ISO8601DateTime, null: true
    field :ended_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
