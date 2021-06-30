# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Add an observation note to an entry request
    class EntryRequestNote < BaseMutation
      argument :id, ID, required: true
      argument :note, String, required: false

      field :event, Types::EntryRequestType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        request = context[:site_community].entry_requests.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found') unless request

        # Add an id to make it easy to identify observations
        data = [{ id: SecureRandom.uuid, time: Time.zone.now, note: vals[:note] }]

        event = context[:current_user].generate_events('observation_log', request, notes: data)
        raise GraphQL::ExecutionError, event.errors.full_messages if event.blank?

        { event: event }
      end
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
