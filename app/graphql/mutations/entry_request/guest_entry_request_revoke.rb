# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Revoke an entry request
    class GuestEntryRequestRevoke < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = Logs::EntryRequest.find(vals[:id])
        revoked_entry_request = context[:current_user].revoke!(entry_request)

        return { entry_request: revoked_entry_request } if revoked_entry_request

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      def authorized?(vals)
        entry_request = Logs::EntryRequest.find(vals[:id])
        raise_entry_request_not_found_error(entry_request)
        return true if context[:current_user]&.role?(%i[custodian admin security_guard]) ||
                       entry_request.user_id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # @return [GraphQL::ExecutionError]
      def raise_entry_request_not_found_error(entry_request)
        return if entry_request

        raise GraphQL::ExecutionError, I18n.t('errors.not_found')
      end
    end
  end
end
