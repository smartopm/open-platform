# frozen_string_literal: true

module Mutations
  module ActivityLog
    # update an activity log for a user
    class UpdateLog < BaseMutation
      argument :ref_id, ID, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(ref_id:)
        event_log = Logs::EventLog.find_by(ref_id: ref_id)
        raise_event_log_not_found_error(event_log)

        event_log.data['enrolled'] = true
        event_log.save
        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :activity_log,
                                  permission: :can_update_activity_log)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if event log does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_event_log_not_found_error(event_log)
        return if event_log

        raise GraphQL::ExecutionError, I18n.t('errors.event_log.not_found')
      end
    end
  end
end
