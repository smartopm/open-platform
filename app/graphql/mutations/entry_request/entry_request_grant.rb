# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = ::EntryRequest.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless entry_request

        if entry_request.grant!(context[:current_user])
          entry_request.notify_admin
          return { entry_request: entry_request }
        end
        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        # removed the admin to allow guards to approve
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
