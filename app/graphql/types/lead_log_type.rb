# frozen_string_literal: true

require 'host_env'

module Types
  # LeadLogType
  class LeadLogType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :acting_user_id, ID, null: false
    field :signed_deal, Boolean, null: true
    field :log_type, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
