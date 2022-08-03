# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Deny an entry request
    class EntryRequestDeny < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = context[:current_user].deny!(vals.delete(:id))
        return { entry_request: entry_request } if entry_request.present?

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_deny_entry)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
