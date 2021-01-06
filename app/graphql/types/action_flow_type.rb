# frozen_string_literal: true

module Types
  # Action Flow Type
  class ActionFlowType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :description, String, null: true
    field :event_type, String, null: true
    field :event_condition, String, null: true
    field :event_condition_query, String, null: true
    field :event_action, GraphQL::Types::JSON, null: true
    field :action_type, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false

    def action_type
      object.event_action['action_name']
    end
  end
end
