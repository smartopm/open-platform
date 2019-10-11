# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending user
    class UpdatePending < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true
      argument :request_reason, String, required: true
      argument :vehicle, String, required: false

      field :id, ID, null: false
      field :request_reason, String, null: false
      field :name, String, null: false
      field :created_at, String, null: false
      field :vehicle, String, null: true

      def resolve(id:, name:, request_reason:, vehicle:)
        user = ::User.find(id)
        return user if user.update(
          name: name,
          request_reason: request_reason, vehicle: vehicle
        )

        raise GraphQL::ExecutionError, user.errors.full_messages
      end
    end
  end
end
