# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class DepositChangeEvent < ActionFlows::EventPop
      EVENT_TYPE = 'deposit_change'
      EVENT_DESC = 'Deposit Update and Create'

      def self.event_metadata
        {
          'Deposit' => obj_data['Deposit'],
        }
      end

      def self.event_metadata_list
        {
          #  TaskUpdateEvent.event_metadata.values.map{|v| v.values }
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(eventlog)
        deposit = eventlog.ref_type.constantize.find eventlog.ref_id
        load_data(
          { 'Deposit' => deposit },
          'amount' => deposit.amount,
          'status' => deposit.status,
          'user_name' => deposit.user.name,
          'user_email' => deposit.user.email,
          'creator' => eventlog.acting_user.name,
        )
      end
    end
  end
end
