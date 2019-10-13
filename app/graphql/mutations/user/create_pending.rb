# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending user
    class CreatePending < BaseMutation
      argument :name, String, required: true
      argument :request_reason, String, required: true
      argument :vehicle, String, required: false

      field :user, Types::UserType, null: true

      def resolve(name:, request_reason:, vehicle:)
        user = ::User.create(
          name: name,
          request_reason: request_reason, vehicle: vehicle,
          community_id: context[:current_user].community_id
        )

        return { user: user } if user

        raise GraphQL::ExecutionError, user.errors.full_messages
      end
    end
  end
end
