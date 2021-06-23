# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, ID, required: true
      argument :subject, String, required: false

      field :entry_request, Types::EntryRequestType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        event = context[:site_community].event_logs.find_by(ref_id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.event_log.not_found') unless event

        entry_request = context[:current_user].grant!(vals[:id], event.id)
        send_notifications(entry_request)
        if entry_request.present?
          # update the subject only if it has been passed
          event.update!(subject: vals[:subject]) if vals[:subject]
          return { entry_request: entry_request }
        end
        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      def send_notifications(entry_request)
        entry_request.notify_admin(true)
        entry_request.send_feedback_link(entry_request.phone_number) if entry_request.phone_number
      end
    end
  end
end
