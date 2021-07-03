# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Add an observation note to an entry request
    class EntryRequestNote < BaseMutation
      argument :id, ID, required: true
      argument :ref_type, String, required: true
      argument :note, String, required: false

      field :event, Types::EventLogType, null: true

      def resolve(vals)
        log = user_or_request(vals)
        raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless log

        evt = context[:current_user].generate_events('observation_log', log, note: vals[:note])
        raise GraphQL::ExecutionError, evt.errors.full_messages if evt.blank?

        { event: evt }
      end

      def user_or_request(args)
        if args[:ref_type] == 'Logs::EntryRequest'
          context[:site_community].entry_requests.find_by(id: args[:id])
        else
          context[:site_community].users.find_by(id: args[:id])
        end
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
