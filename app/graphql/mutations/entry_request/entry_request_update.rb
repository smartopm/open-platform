
# frozen_string_literal: true

module Mutations
  module EntryRequest

    # Create a new request/pending member
    class EntryRequestUpdate < BaseMutation
      argument :name, String, required: false
      argument :nrc, String, required: false
      argument :phone_number, String, required: false
      argument :vehicle_plate, String, required: false
      argument :reason, String, required: false
      argument :other_reason, String, required: false
      argument :concern_flag, GraphQL::Types::Boolean, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = EntryRequest.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless entry_request

        return { entry_request: entry_request } if entry_request.update(vals)
        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user
        true
      end
    end
  end
end
