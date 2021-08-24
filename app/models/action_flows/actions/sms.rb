# frozen_string_literal: true

# require 'sms'

module ActionFlows
  module Actions
    # Action defined to create a task
    class Sms
      def self.execute_action(data, _field_config = nil)
        community = ::Community.find_by(id: data[:task_create_community_id])
        author_name = Users::User.find(data[:task_create_author_id]).name
        message = "#{author_name} just created a task '#{data[:task_create_body]}'"
        send_sms_custodian(community, message)
        return unless data[:task_create_user_type] == 'custodian'

        ::Sms.send(community&.security_manager, message)
      end

      def self.send_sms_custodian(comm, message)
        custodians = comm.users.where(user_type: 'custodian')
        custodians.each do |user|
          ::Sms.send(user.phone_number, message)
        end
      end
    end
  end
end
