# frozen_string_literal: true

module Mutations
  module ActivityLog
    # update a log with an observation note
    class AddObservation < BaseMutation
      argument :id, ID, required: true
      argument :note, String, required: false

      field :event_log, Types::EventLogType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        event_log = context[:site_community].event_logs.find_by(ref_id: vals[:id])
        raise_event_log_not_found_error(event_log)

        note = { id: SecureRandom.uuid, time: Time.zone.now, note: vals[:note] }
        event_log.data['notes'] << note
        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

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
