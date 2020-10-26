# frozen_string_literal: true

module ActionFlows
  module Actions
    # Action defined for firing email

    ACTION_FIELDS = [
      {'name' => 'email' }
      {'name'=> 'template'}]
    class Email
      def self.run_action(users, mail_data)
        users.each do |user|
          EmailMsg.send_mail(user['email'], community_template, mail_data)
        end
      end

      def self.process_vars(field, data, field_config)
        ret_val = nil
        if field_config[field]['type'] == 'variable'
          ret_val = data[field_config[field]['value']]
        else
          ret_val = field_config[field]['value']
        end
        ret_val
      end

      def self.execute_action(data, field_config)
        emails = self.process_vars('email', data, field_config)
        template = self.process_vars('template', data, field_config)
        emails.split(",").each do |email|
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
