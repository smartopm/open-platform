# frozen_string_literal: true

require 'task_create'

module ActionFlows
  module Actions
    # Action defined to create a task
    class Task
      ACTION_FIELDS = [
        { name: 'body', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'select' },
        { name: 'assignees', type: 'select' },
        { name: 'user_id', type: 'text' },
        { name: 'due_date', type: 'date' },
        { name: 'author_id', type: 'text' },
      ].freeze

      def self.process_vars(field, data, field_config)
        return unless field_config[field]

        if field_config[field]['type'] == 'variable'
          return data[(field_config[field]['value']).to_sym]
        end

        field_config[field]['value']
      end

      def self.execute_action(data, field_config, _event_log)
        hash = {}
        ACTION_FIELDS.each do |field|
          field_name = field[:name]
          hash[field_name.to_sym] = process_vars(field_name, data, field_config)
        end

        TaskCreate.new_from_action(hash)
      end
    end
  end
end
