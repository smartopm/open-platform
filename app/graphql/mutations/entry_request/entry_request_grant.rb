# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = context[:current_user].grant!(vals[:id])
        send_notifications(entry_request)
        return { entry_request: entry_request } if entry_request.present?

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

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
