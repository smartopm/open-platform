# frozen_string_literal: true

require 'host_env'

module Types
  # LeadLogType
  class LeadLogType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :acting_user_id, ID, null: false
    field :signed_deal, Boolean, null: false
    field :log_type, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
