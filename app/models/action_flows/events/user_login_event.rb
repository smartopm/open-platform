# frozen_string_literal: true

module ActionFlows
  module Events
    # User Login Event to handle related action
    class UserLoginEvent < ActionFlows::EventPop
      EVENT_TYPE = 'user_login'
      EVENT_DESC = 'User Login'

      def self.event_metadata
        {
          'User' => obj_data['User'],
        }
      end

      def self.event_metadata_list
        #  UserLoginEvent.event_metadata.values.map{|v| v.values }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(event_log)
        user = event_log.ref_type.constantize.find(event_log.ref_id)
        load_data('User' => user)
      end
    end
  end
end
