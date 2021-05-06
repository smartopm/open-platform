# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new request/pending member
    class EntryRequestUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :nrc, String, required: false
      argument :phone_number, String, required: false
      argument :vehicle_plate, String, required: false
      argument :reason, String, required: false
      argument :other_reason, String, required: false
      argument :concern_flag, GraphQL::Types::Boolean, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = ::EntryRequest.find(vals.delete(:id))
        raise_entry_request_not_found_error(entry_request)

        return { entry_request: entry_request } if entry_request.update(vals)

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if entry request does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_entry_request_not_found_error(entry_request)
        return if entry_request

        raise GraphQL::ExecutionError, I18n.t('errors.not_found')
      end
    end
  end
end
