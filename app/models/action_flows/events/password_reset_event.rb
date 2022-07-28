# frozen_string_literal: true

module ActionFlows
  module Events
    # User Create Event to handle related action
    class PasswordResetEvent < ActionFlows::EventPop
      EVENT_TYPE = 'reset_user_password'
      EVENT_DESC = 'Reset User Password'

      def self.event_metadata
        {
          'User' => obj_data['User'],
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(event_log, extra_data = {})
        user = event_log.ref_type.constantize.find_by(id: event_log.ref_id)
        load_data('User' => user,  'password' => extra_data[:password]
                  'username' => extra_data[:username])
      end
    end
  end
end
