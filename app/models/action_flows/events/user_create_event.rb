# frozen_string_literal: true

module ActionFlows
  module Events
    # User Create Event to handle related action
    class UserCreateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'user_create'
      EVENT_DESC = 'User Create'

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
        # removing the lead condition as going forward they will be
        # created as qualified leads and they should be able to login
        return if user.blank?

        load_data({ 'User' => user },
                  'password' => extra_data[:password],
                  'username' => user.username)
      end
    end
  end
end
