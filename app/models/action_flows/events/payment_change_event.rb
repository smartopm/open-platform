# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class PaymentChangeEvent < ActionFlows::EventPop
      EVENT_TYPE = 'payment_change'
      EVENT_DESC = 'Payment Update and Create'

      def self.event_metadata
        {
          'Payment' => obj_data['Payment'],
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
        payment = eventlog.ref_type.constantize.find eventlog.ref_id
        load_data(
          { 'Payment' => payment },
          'amount' => payment.amount,
          'status' => payment.payment_status,
          'invoice_user_name' => payment.invoice.user.name,
          'invoice_user_email' => payment.invoice.user.email,
          'invoice_status' => payment.invoice.status,
          'invoice_amount' => payment.invoice.amount,
        )
      end
    end
  end
end
