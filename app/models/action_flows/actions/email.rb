# frozen_string_literal: true

module ActionFlows
  module Actions
    # Action defined for firing email
    class Email
      ACTION_FIELDS = [
        { name: 'email', type: 'text' },
        { name: 'template', type: 'text' },
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
        emails.split(',').each do |email|
          EmailMsg.send_mail(email, template, mail_data(data, field_config))
        end
      end

      def self.mail_data(data, field_config)
        hash = {}
        (field_config.keys - %w[email template]).each do |var|
          hash[var.to_sym] = process_vars(var, data, field_config)
        end
        hash
      end
    end
  end
end
