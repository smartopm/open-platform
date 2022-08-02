# frozen_string_literal: true

module Mutations
  module Login
    # Username Password login
    class LoginUsernamePassword < BaseMutation
      argument :username, String, required: true
      argument :password, String, required: true

      field :user, Types::UserType, null: true

      def resolve(vals)
        user = Users::User.authenticate(vals[:username], vals[:password])
        raise_bad_credentials_error if user.nil?

        { user: user }
      end

      private

      # Raises GraphQL execution error if wrong authentication credentials are passed
      #
      # @return [GraphQL::ExecutionError]
      def raise_bad_credentials_error
        raise GraphQL::ExecutionError, I18n.t('errors.authentication.wrong_credentials')
      end
    end
  end
end
