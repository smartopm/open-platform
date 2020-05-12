# frozen_string_literal: true

module Mutations
  module ActivityLog
    # update an activity log for a user
    class UpdateLog < BaseMutation
      argument :ref_id, ID, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(ref_id:)
        event_log = ::EventLog.find_by(ref_id: ref_id)
        raise GraphQL::ExecutionError, 'Event Log not found' unless event_log

        event_log.data['enrolled'] = true
        event_log.save
        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
