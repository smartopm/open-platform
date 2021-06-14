# frozen_string_literal: true

module ActionFlows
  module Actions
    # Action defined for firing email
    class CustomEmail
      include ActionFieldsFetchable

      ACTION_FIELDS = [
        { name: 'email', type: 'text' },
        { name: 'template', type: 'select' },
      ].freeze

      def self.execute_action(data, field_config)
        emails = ActionFieldsFetchable.process_vars('email', data, field_config) || ''
        template = ActionFieldsFetchable.process_vars('template', data, field_config)
        template_obj = Notifications::EmailTemplate.find(template)
        emails.split(',').each do |user_email|
          vars = template_data(data, field_config, template_obj)
          EmailMsg.send_mail_from_db(user_email, template_obj, vars)
        end
      end

      def self.template_data(data, field_config, template_obj)
        template_variables = template_obj.template_variables
        return if template_variables.nil?

        vars = JSON.parse(template_variables).map { |_key, val| val }.flatten
        values = []
        vars.each do |variable|
          value = ActionFieldsFetchable.process_vars(variable, data, field_config)
          values.append({ key: "%#{variable}%", value: value.to_s })
        end
        values
      end
    end
  end
end
