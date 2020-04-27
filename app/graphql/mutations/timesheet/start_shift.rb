# frozen_string_literal: true

module Mutations
  module Timesheet
    # Create timesheet record
    class StartShift < BaseMutation
      argument :user_id, ID, required: true
      argument :start_date, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(user_id:, start_date:)
        user = context[:current_user].find_a_user(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        data = { ref_name: user.name, type: user.user_type, shift: { start_date: start_date } }
        begin
          event_log = context[:current_user].generate_events('user_shift', user, data)
          return { event_log: event_log } if event_log.present?
        rescue StandardError
          raise GraphQL::ExecutionError, event_log.errors.full_messages
        end
        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.custodian?

        true
      end
    end
  end
end
