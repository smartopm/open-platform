module Types
  # Action Flow Type
  class ActionFlowType < Types::BaseObject
    field :description, String, null: true
    field :event_type, String, null: true
    field :event_condition, String, null: true
    field :event_action, GraphQL::Types::JSON, null: true
  end
end
