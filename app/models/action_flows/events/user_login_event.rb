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

      def initialize
        super
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def setup_data(user_data)
        load_data('User' => user_data)
      end

      def preload_data; end

      def url_format; end
    end
  end
end
