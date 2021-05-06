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

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
