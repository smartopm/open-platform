# frozen_string_literal: true

module ActionFlows
  module Actions
    ACTION_FIELDS = [
      { 'name' => 'email' },
      { 'name' => 'template' },
    ].freeze

    # Action defined for firing email
    class Email
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
          EmailMsg.send_mail(email, template)
        end
      end

      # Method temporarily here, need a more generic way to get template id : Saurabh
      def self.community_template
        'd-285b8ab4099b424a93fc04be801a87db'
      end
    end
  end
end