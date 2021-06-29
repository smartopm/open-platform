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

        ActiveRecord::Base.transaction do
          entry_request = context[:current_user].grant!(vals[:id], event.id)
          raise GraphQL::ExecutionError, entry_request.errors.full_messages if entry_request.blank?

          phone_number = entry_request.phone_number
          entry_request.send_feedback_link(phone_number) if phone_number
          event.update!(subject: vals[:subject]) if vals[:subject]
          { entry_request: entry_request }
        end
      end
      # rubocop:enable Metrics/AbcSize

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin custodian])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
