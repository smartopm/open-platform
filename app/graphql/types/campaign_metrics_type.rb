# frozen_string_literal: true

module Types
  # CampaignMetrics Type
  class CampaignMetricsType < Types::BaseObject
    field :batch_time, GraphQL::Types::ISO8601DateTime, null: true
    field :start_time, GraphQL::Types::ISO8601DateTime, null: true
    field :end_time, GraphQL::Types::ISO8601DateTime, null: true
    field :total_scheduled, String, null: true
    field :total_sent, String, null: true
    field :total_clicked, String, null: true
    field :total_opened, String, null: true
  end
end
