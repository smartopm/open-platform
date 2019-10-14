# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Create < BaseMutation
      argument :name, String, required: true
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false

      field :user, Types::UserType, null: true

      def resolve(vals)
        user = ::User.new(vals)
        user.community_id = context[:current_user].community_id

        return { user: user } if user.save

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
