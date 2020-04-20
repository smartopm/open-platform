# frozen_string_literal: true

module Mutations
  module Temperature
    # Create an event for temperature record
    class TemperatureUpdate < BaseMutation
      argument :temp, String, required: true
      argument :ref_id, ID, required: true
      argument :ref_name, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(temp:, ref_id:, ref_name:)
        event_log = log_temperature(temp, ref_id, ref_name)
        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def log_temperature(temp, id, name)
        ::EventLog.new(acting_user_id: context[:current_user].id,
                       community_id: context[:current_user].community_id, subject: 'user_temp',
                       ref_id: id,
                       ref_type: 'User',
                       data: {
                         ref_name: name,
                         note: temp,
                         type: 'Temp', # we don't have specific user type here
                       })
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
