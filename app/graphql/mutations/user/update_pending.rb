# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending user
    class UpdatePending < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true
      argument :request_reason, String, required: true
      argument :vehicle, String, required: false

      field :user, Types::UserType, null: true

      def resolve(id:, name:, request_reason:, vehicle:)
        user = ::User.find(id)
        return { user: user } if user.update(
          name: name,
          request_reason: request_reason, vehicle: vehicle
        )

        raise GraphQL::ExecutionError, user.errors.full_messages
      end
    end
  end
end
