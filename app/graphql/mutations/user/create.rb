# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Create < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false

      field :id, ID, null: false
      field :name, String, null: false
      field :email, String, null: false
      field :phone_number, String, null: false
      field :user_type, String, null: false
      field :state, String, null: false
      field :created_at, String, null: false
      field :request_reason, String, null: true
      field :vehicle, String, null: true

      def resolve(vals)
        user = ::User.create(vals, community_id: context[:current_user].community_id)
        raise GraphQL::ExecutionError, 'NotFound' unless user

        return user if user.update(vals)

        raise GraphQL::ExecutionError, member.errors.full_messages
      end

      def authorized?(_vars)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user.admin?

        true
      end
    end
  end
end
