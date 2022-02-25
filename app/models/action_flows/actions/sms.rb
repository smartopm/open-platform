# frozen_string_literal: true

require 'host_env'

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
        assign_user = Users::User.find(data[:task_assign_user_id])
        return if assign_user.user_type.eql?('lead')

        author_msg = generate_message(data, assign_user)
        assignee_msg = generate_assignee_msg(data, assign_user)

        hash = action_flow_fields(data, field_config)

        ::Sms.send(assign_user.phone_number, author_msg) unless assign_user.phone_number.nil?
        ::Sms.send(hash[:phone_number], assignee_msg)
      end

      def self.generate_url(user, task_id)
        "https://#{HostEnv.base_url(user.community)}/tasks/#{task_id}"
      end

      def self.generate_message(data, assign_user)
        <<~HEREDOC
          Task '#{data[:task_assign_body]}' was assigned to you
          #{generate_url(assign_user, data[:task_assign_note_id])}
        HEREDOC
      end

      def self.generate_assignee_msg(data, assign_user)
        author = Users::User.find(data[:task_assign_author_id]).name
        <<~HEREDOC
          #{author} just assigned a task '#{data[:task_assign_body]}'
          to #{assign_user.name} #{generate_url(assign_user, data[:task_assign_note_id])}
        HEREDOC
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
