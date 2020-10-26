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

    def self.find_by_event_type(event_type)
      ActionFlows::ActionFlow.load_flows.select { |e| e.event_type == event_type }
    end

    # rubocop:disable Metrics/MethodLength
    def self.load_flows
      [{
        'description' => 'Email On task update',
        'event_type' => 'task_update',
        'event_condition' => '{"==":[1,1]}',
        'event_action' => {
          'action_name' => 'email',
          'action_fields' => {
            'email' => {
              'name' => 'email',
              'value' => 'note_assignees_emails',
              'type' => 'variable',
            }, 'template' => {
              'name' => 'template',
              'value' => 'd-285b8ab4099b424a93fc04be801a87db',
              'type' => 'string',
            }
          },
        },
      }, {
        'description' => 'NOT READYEmail On task update',
        'event_type' => 'note_comment_update',
        'event_condition' => '',
        'event_action' => 'email',
      },
       {
         'description' => 'NOT READYEmail On task update',
         'event_type' => 'note_comment_create',
         'event_condition' => '',
         'event_action' => 'email',
       }].map do |e|
        ActionFlows::ActionFlow.new(e['description'], e['event_type'],
                                    e['event_condition'], e['event_action'])
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
