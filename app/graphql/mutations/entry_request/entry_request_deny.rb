# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Deny an entry request
    class EntryRequestDeny < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = ::EntryRequest.find(vals.delete(:id))
        event_log = entry_request.get_last_event
        raise GraphQL::ExecutionError, 'NotFound' unless entry_request

        if entry_request.deny!(context[:current_user],event_log.id)
          entry_request.notify_admin(false)
          return { entry_request: entry_request }
        end
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
