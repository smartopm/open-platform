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
    unless permitted?(module: :action_flow,
                      permission: :can_get_action_flow_events)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    ActionFlows::EventPop.event_list.map { |event| event::EVENT_TYPE }
  end

  def actions
    unless permitted?(module: :action_flow, permission: :can_get_action_flow_actions)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    actions = ActionFlows::Actions.constants.select do |c|
      ActionFlows::Actions.const_get(c).is_a?(Class)
    end

    actions.map { |ac| ac.to_s.titleize }
  end

  def action_fields(action:)
    unless permitted?(module: :action_flow, permission: :can_get_action_flow_action_fields)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    begin
      fields = "ActionFlows::Actions::#{action.gsub(' ', '_').camelize}::ACTION_FIELDS".constantize
      fields.map { |f| OpenStruct.new(f) }
    rescue StandardError
      raise GraphQL::ExecutionError, I18n.t('errors.action_flow.invalid_action_name')
    end
  end

  def rule_fields(event_type:)
    permission_checks?
    begin
      event_class = "ActionFlows::Events::#{event_type.camelize}Event".constantize
      metadata = event_class.event_metadata
      prefix = metadata.keys.first.underscore

      metadata.values.first.keys.map { |f| "#{prefix}_#{f}" }
    rescue StandardError
      raise GraphQL::ExecutionError, I18n.t('errors.action_flow.invalid_event_type')
    end
  end

  def action_flows(offset: 0, limit: 10)
    unless permitted?(module: :action_flow,
                      permission: :can_get_action_flow_list)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].action_flows.order(created_at: :desc).limit(limit).offset(offset)
  end

  def permission_checks?
    return true if permitted?(module: :action_flow, permission: :can_get_action_flow_rule_fields)

    raise GraphQL::ExecutionError,
          I18n.t('errors.unauthorized')
  end
end
