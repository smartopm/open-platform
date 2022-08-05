# frozen_string_literal: true

module Mutations
  module User
    # Reset user password after login
    class ResetPasswordAfterLogin < BaseMutation
      argument :password, String, required: true
      argument :user_id, ID, required: true

      field :auth_token, String, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        auth_object = user.reset_password_on_first_login(user.username, vals[:password])
        raise_reset_password_error if auth_object.nil?
        auth_token = auth_object.auth_token
        {
          auth_token: auth_token,
        }
      end

      private

      # Raises GraphQL execution error if wrong authentication credentials are passed
      #
      # @return [GraphQL::ExecutionError]
      def raise_reset_password_error
        raise GraphQL::ExecutionError, I18n.t('errors.authentication.reset_password_error')
      end
    end
  end
end
