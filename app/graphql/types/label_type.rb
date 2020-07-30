# frozen_string_literal: true

module Types
  # LabelType
  class LabelType < Types::BaseObject
    field :id, ID, null: false
    field :short_desc, String, null: true
    field :community, Types::CommunityType, null: false
    field :users, [Types::UserType], null: false
    field :campaigns, [Types::CampaignType], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
