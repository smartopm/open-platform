# frozen_string_literal: true

# require 'sms'

module ActionFlows
  module Actions
    # Action defined to create a task
    class Sms
      ACTION_FIELDS = [
        { name: 'phone_number', type: 'text' },
      ].freeze

      def self.process_vars(field, data, field_config)
        return unless field_config[field]

        if field_config[field]['type'] == 'variable'
          return data[(field_config[field]['value']).to_sym]
        end

        field_config[field]['value']
      end

      def self.execute_action(data, field_config)
        author = Users::User.find(data[:task_assign_author_id]).name
        assign_user = Users::User.find(data[:task_assign_user_id])
        message = "Task '#{data[:task_assign_body]}' was assigned to you"
        msg = "#{author} just assigned a task '#{data[:task_assign_body]}' to #{assign_user.name}"

        hash = action_flow_fields(data, field_config)

        ::Sms.send(assign_user.phone_number, message) unless assign_user.phone_number.nil?
        ::Sms.send(hash[:phone_number], msg)
      end

      def self.action_flow_fields(data, field_config)
        hash = {}
        ACTION_FIELDS.each do |field|
          field_name = field[:name]
          hash[field_name.to_sym] = process_vars(field_name, data, field_config)
        end
        hash
      end
    end
  end
end
