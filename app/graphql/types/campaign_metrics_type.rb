# frozen_string_literal: true

module Types
  # CampaignMetrics Type
  class CampaignMetricsType < Types::BaseObject
    field :batch_time, Types::Scalar::DateType, null: true
    field :start_time, Types::Scalar::DateType, null: true
    field :end_time, Types::Scalar::DateType, null: true
    field :total_scheduled, String, null: true
    field :total_sent, String, null: true
    field :total_clicked, String, null: true
  end
end
