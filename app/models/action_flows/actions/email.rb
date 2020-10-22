module ActionFlows
  module Actions
    class Email
      def self.run_action(user_ids)
        users = User.where(id: user_ids)
        return if users.empty?

        users.each do |user|
          EmailMsg.send_mail(user.email, community_template, {})
        end
      end

      # Method temporarily here, need a more generic way to get template id : Saurabh
      def self.community_template
        "d-1fe3bcf8035c4c1c9737e147c4eb31c6"
        # templates = user.community.templates
        # return {} if templates.nil?

        # templates['notification_template_id']
      end
    end
  end
end
