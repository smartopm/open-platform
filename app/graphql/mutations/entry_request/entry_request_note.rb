# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Add an observation note to an entry request
    class EntryRequestNote < BaseMutation
      argument :id, ID, required: false
      argument :ref_type, String, required: false
      argument :note, String, required: false

      field :event, Types::EventLogType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        if vals[:note].blank?
          raise GraphQL::ExecutionError, I18n.t('errors.entry_request.empty_note')
        end

        log = vals[:ref_type]&.constantize&.find_by(
          id: vals[:id],
          community_id: context[:site_community].id,
        )

        evt = context[:current_user].generate_events('observation_log', log, note: vals[:note])
        raise GraphQL::ExecutionError, evt.errors.full_messages if evt.blank?

        { event: evt }
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
