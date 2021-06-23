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
    field :status, String, null: false
    field :include_reply_link, Boolean, null: false
    field :email_templates_id, ID, null: true
    field :labels, [Types::LabelType], null: true
    field :start_time, Types::Scalar::DateType, null: true
    field :end_time, Types::Scalar::DateType, null: true
    field :batch_time, Types::Scalar::DateType, null: true
    field :created_at, Types::Scalar::DateType, null: true
    field :updated_at, Types::Scalar::DateType, null: true
    field :created_at, Types::Scalar::DateType, null: true
    field :campaign_metrics, Types::CampaignMetricsType, null: true
  end
end
