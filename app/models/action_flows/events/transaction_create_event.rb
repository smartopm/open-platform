# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class TransactionCreateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'transaction_create'
      EVENT_DESC = 'Transaction Create'

      def self.event_metadata
        {
          'Transaction' => obj_data['Transaction'],
        }
      end

      def self.event_metadata_list
        {
          #  TransactionCreateEvent.event_metadata.values.map{|v| v.values }
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(eventlog)
        transaction = eventlog.ref_type.constantize.find eventlog.ref_id
        load_data(
          { 'Transaction' => transaction },
          'user_email' => transaction.user.email,
          'user_name' => transaction.user.name,
        )
      end
    end
  end
end
