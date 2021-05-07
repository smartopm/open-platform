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
        raise_user_not_found_error(user)

        user&.send_phone_token

        { user: user }
      end

      private

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
      end
    end
  end
end
