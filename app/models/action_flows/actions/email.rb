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
        {
          url: process_vars('url', data, field_config),
          body: process_vars('body', data, field_config),
        }
      end

      # Method temporarily here, need a more generic way to get template id : Saurabh
      def self.community_template
        'd-285b8ab4099b424a93fc04be801a87db'
      end
    end
  end
end
