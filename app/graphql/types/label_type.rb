# frozen_string_literal: true

module Types
  # LabelType
  class LabelType < Types::BaseObject
    field :id, ID, null: false
    field :short_desc, String, null: true
    field :community, Types::CommunityType, null: false
    field :color, String, null: true
    field :description, String, null: true
    field :users, [Types::UserType], null: false
    field :user_count, Integer, null: true
    field :campaigns, [Types::CampaignType], null: false
    field :grouping_name, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
