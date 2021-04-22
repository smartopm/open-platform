# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Deny an entry request
    class EntryRequestAcknowledge < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = Logs::EntryRequest.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless entry_request

        return { entry_request: entry_request } if entry_request.acknowledge!

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
