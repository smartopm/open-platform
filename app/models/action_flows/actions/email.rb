# frozen_string_literal: true

module ActionFlows
  module Actions
    # Action defined for firing email
    class Email
      def self.run_action(users, mail_data)
        users.each do |user|
          EmailMsg.send_mail(user['email'], community_template, mail_data)
        end
      end

      # Method temporarily here, need a more generic way to get template id : Saurabh
      def self.community_template
        'd-285b8ab4099b424a93fc04be801a87db'
      end
    end
  end
end
