# frozen_string_literal: true

module Mutations
  module Login
    # Start a phone login
    class LoginPhoneStart < BaseMutation
      argument :phone_number, String, required: true

      field :user, Types::UserType, null: true
      field :errors, String, null: false

      def resolve(vals)
        user = context[:site_community].users.find_any_via_phone_number(vals[:phone_number])
        raise GraphQL::ExecutionError, 'User not found' unless user

        user&.send_phone_token

        { user: user }
      end
    end
  end
end
