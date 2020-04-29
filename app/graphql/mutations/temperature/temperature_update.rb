# frozen_string_literal: true

require 'set'

module Mutations
  module Temperature
    # Create an event for temperature record
    class TemperatureUpdate < BaseMutation
      argument :temp, String, required: true
      argument :ref_id, ID, required: true
      argument :ref_name, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(temp:, ref_id:, ref_name:)
        a_user = context[:current_user].find_a_user(ref_id)
        data = { ref_name: ref_name, note: temp }
        begin
          event_log = a_user.generate_events('user_temp', a_user, data)
          return { event_log: event_log } if event_log.present?
        rescue StandardError => e
          Rails.logger.warn e.full_message
          raise GraphQL::ExecutionError, "For some reason, I can't process your request"
        end
      end

      # TODO: Better auth here
      def authorized?(_vals)
        a_roles = Set['admin', 'security_guard']
        c_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless a_roles.include? c_user.user_type

        true
      end
    end
  end
end
