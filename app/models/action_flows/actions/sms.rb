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
        message = "Task '#{data[:task_assign_body]}' has just been assigned to #{author}"
        a_s = "#{author} just assigned a task '#{data[:task_assign_body]}' to #{assign_user.name}"

        hash = action_flow_fields(data, field_config)
        sms_head_custodian(data[:task_assign_user_type], hash[:phone_number], a_s)

        return unless assign_user.user_type == 'custodian'

        sms_custodian(assign_user.phone_number, hash[:phone_number], message)
      end

      def self.sms_head_custodian(user_type, phone_number, message)
        ::Sms.send(phone_number, message) if user_type == 'custodian'
      end

      def self.action_flow_fields(data, field_config)
        hash = {}
        ACTION_FIELDS.each do |field|
          field_name = field[:name]
          hash[field_name.to_sym] = process_vars(field_name, data, field_config)
        end
        hash
      end

      def self.sms_custodian(phone_number, hash_phone_number, message)
        ::Sms.send(phone_number, message)
        ::Sms.send(hash_phone_number, message)
      end
    end
  end
end
