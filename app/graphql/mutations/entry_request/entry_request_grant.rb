
# frozen_string_literal: true

module Mutations
  module EntryRequest

    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, String, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = EntryRequest.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless entry_request

        return { entry_request: entry_request } if entry_request.grant!(context[:user])
        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user && current_user.admin?
        true
      end
    end
  end
end
