# frozen_string_literal: true

module Mutations
  module Login
    # Start a phone login
    class LoginEmail < BaseMutation
      argument :email, String, required: false

      field :user, Types::UserType, null: true
      field :errors, String, null: false

      def resolve(vals)
        raise_email_blank_error(vals[:email])

        user = context[:site_community].users.find_any_via_email(vals[:email])
        raise_user_not_found_error(user)

        user&.send_one_time_login_email

        { user: user }
      end

      private

      # Raises GraphQL execution error if phone number is blank
      #
      # @param email [String]
      #
      # @return [GraphQL::ExecutionError]
      def raise_email_blank_error(email)
        return if email.present?

        raise GraphQL::ExecutionError, I18n.t('errors.email.found_blank')
      end

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
