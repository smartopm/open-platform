# frozen_string_literal: true

# Actionflow queries
module Types::Queries::ActionFlow
  extend ActiveSupport::Concern

  included do
    # Get all events
    field :events, [GraphQL::Types::String], null: false do
      description 'Get all events'
    end

    # Get all actions
    field :actions, [GraphQL::Types::String], null: false do
      description 'Get all actions'
    end

    # Get fields for an action
    field :action_fields, [Types::ActionFieldType], null: true do
      description 'Get fields for an action'
      argument :action, String, required: true
    end
  end

  def events
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    ActionFlows::EventPop.event_list.map { |event| event::EVENT_TYPE }
  end

  def actions
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    actions = ActionFlows::Actions.constants.select do |c|
      ActionFlows::Actions.const_get(c).is_a?(Class)
    end.map(&:to_s)
  end

  def action_fields(action:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    begin
      fields = "ActionFlows::Actions::#{action.camelize}::ACTION_FIELDS".constantize
      fields.map { |f| OpenStruct.new(f) }
    rescue => e
      nil
    end
  end
end
