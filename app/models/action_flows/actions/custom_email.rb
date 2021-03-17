# frozen_string_literal: true

module ActionFlows
  module Actions
    # Action defined for firing email
    class CustomEmail
      include ActionFieldsFetchable

      ACTION_FIELDS = [
        { name: 'template_variables', type: 'json' },
      ].freeze

      def self.process_vars(field, data, field_config)
        return unless field_config[field]

        if field_config[field]['type'] == 'variable'
          return data[(field_config[field]['value']).to_sym]
        end

        field_config[field]['value']
      end
  
      def self.execute_action(data, field_config)
        emails = process_vars('email', data, field_config) || ''
        template = process_vars('template', data, field_config)
        template_obj = EmailTemplate.find(template)
        emails.split(',').each do |user_email|
          vars = template_data(data, field_config)
          EmailMsg.send_mail_from_db(user_email, template_obj, vars)
        end
      end

      def self.template_data(data, field_config)
        vars_json = JSON.parse(process_vars('template_vairables', data, field_config))
        vars = []
        vars_json.each do |key, value|
          vars.append({ key: "%#{key}%", value: data[value.to_sym] })
        end
        vars
      end
    end
  end
end
