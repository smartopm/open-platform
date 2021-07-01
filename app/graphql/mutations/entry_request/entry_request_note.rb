# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Add an observation note to an entry request
    class EntryRequestNote < BaseMutation
      argument :id, ID, required: true
      argument :note, String, required: false

      field :entry, Types::EventLogType, null: true

      def resolve(vals)
        request = context[:site_community].entry_requests.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found') unless request

        evt = context[:current_user].generate_events('observation_log', request, note: vals[:note])
        raise GraphQL::ExecutionError, evt.errors.full_messages if evt.blank?

        { event: evt }
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
