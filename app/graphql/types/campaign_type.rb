# frozen_string_literal: true

module Types
  # CampaignType
  class CampaignType < Types::BaseObject
    field :id, ID, null: false
    field :community_id, ID, null: false
    field :name, String, null: false
    field :campaign_type, String, null: false
    field :message, String, null: true
    field :user_id_list, String, null: true
    field :subject, String, null: true
    field :status, String, null: true
    field :pre_header, String, null: true
    field :template_style, String, null: true
    field :status, String, null: false
    field :labels, [Types::LabelType], null: true
    field :start_time, GraphQL::Types::ISO8601DateTime, null: true
    field :end_time, GraphQL::Types::ISO8601DateTime, null: true
    field :batch_time, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :campaign_metrics, Types::CampaignMetricsType, null: true
  end
end
