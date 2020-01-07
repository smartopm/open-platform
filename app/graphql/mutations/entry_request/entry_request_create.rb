# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new request/pending member
    class EntryRequestCreate < BaseMutation
      argument :name, String, required: true
      argument :nrc, String, required: false
      argument :phone_number, String, required: false
      argument :vehicle_plate, String, required: false
      argument :reason, String, required: false
      argument :other_reason, String, required: false
      argument :concern_flag, GraphQL::Types::Boolean, required: false
      argument :source, String, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = context[:current_user].entry_requests.create(vals)

        return { entry_request: entry_request } if entry_request.persisted?

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
