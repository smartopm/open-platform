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

    # Get fields for an event, to populate the Rule widget
    field :rule_fields, [GraphQL::Types::String], null: true do
      description 'Get fields for an event'
      argument :event_type, String, required: true
    end

    # Fetch action flows
    field :action_flows, [Types::ActionFlowType], null: false do
      description 'Fetches action-flows'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def events
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    ActionFlows::EventPop.event_list.map { |event| event::EVENT_TYPE }
  end

  def actions
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    ActionFlows::Actions.constants.select do |c|
      ActionFlows::Actions.const_get(c).is_a?(Class)
    end.map(&:to_s)
  end

  def action_fields(action:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    begin
      fields = "ActionFlows::Actions::#{action.camelize}::ACTION_FIELDS".constantize
      fields.map { |f| OpenStruct.new(f) }
    rescue StandardError
      raise GraphQL::ExecutionError, 'Invalid action name'
    end
  end

  # rubocop:disable Metrics/AbcSize
  def rule_fields(event_type:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    begin
      event_class = "ActionFlows::Events::#{event_type.camelize}Event".constantize
      metadata = event_class.event_metadata
      prefix = metadata.keys.first.underscore

      metadata.values.first.keys.map { |f| "#{prefix}_#{f}" }
    rescue StandardError
      raise GraphQL::ExecutionError, 'Invalid event type'
    end
  end

  def action_flows(offset: 0, limit: 10)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    ActionFlow.order(:created_at).limit(limit).offset(offset)
  end
end
