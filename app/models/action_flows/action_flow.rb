# frozen_string_literal: true

module ActionFlows
  # Class to run JSONLogic with passed rules and data
  class ActionFlow
    #  ActionFlows::ActionFlow
    attr_accessor :description
    attr_accessor :event_type
    attr_accessor :event_condition
    attr_accessor :event_action

    def initialize(description, event_type, event_condition, event_action)
      @event_type = event_type
      @event_condition = event_condition
      @event_action = event_action
      @description = description
    end

    def action
      "ActionFlows::Actions::#{action_type.camelize}".constantize
    end

    def action_type
      return nil if @event_action.blank? && @event_action['action_name'].blank?

      @event_action['action_name']
    end

    def action_fields
      return nil if @event_action.blank? && @event_action['action_fields'].blank?

      @event_action['action_fields']
    end

    def condition
      @event_condition.presence || nil
    end

    def event_object
      val = ActionFlows::EventPop.event_list.select do |evt|
        evt.event_type == @event_type
      end
      return val[0] if val.present? && !val.empty?

      nil
    end
  end
end
