# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Revoke an entry request
    class GuestEntryRequestRevoke < BaseMutation
      argument :id, ID, required: true
      # argument :user_id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = Logs::EntryRequest.find(vals[:id])
        revoked_entry_request = context[:current_user].revoke!(entry_request)

        return { entry_request: revoked_entry_request } if revoked_entry_request

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      def authorized?(vals)
        entry_request = Logs::EntryRequest.find_by(id: vals[:id])
        raise_entry_request_not_found_error(entry_request)
        return true if permitted?(module: :entry_request,
                                  permission: :can_revoke_entry_request) ||
                       current_user_is_owner(entry_request)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # @return [GraphQL::ExecutionError]
      def raise_entry_request_not_found_error(entry_request)
        return if entry_request

        raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found')
      end

      def permissions_check?
        permitted?(module: :entry_request, permission: :can_revoke_entry_request)
      end

      def current_user_is_owner(entry_request)
        return true if entry_request.user_id.eql?(context[:current_user].id)
      end
    end
  end
end
