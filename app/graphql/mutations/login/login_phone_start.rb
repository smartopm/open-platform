# frozen_string_literal: true

module Mutations
  module Login
    # Start a phone login
    class LoginPhoneStart < BaseMutation
      argument :phone_number, String, required: false

      field :user, Types::UserType, null: true
      field :errors, String, null: false

      def resolve(vals)
        raise_phone_number_blank_error(vals[:phone_number])

        user = context[:site_community].users.find_any_via_phone_number(vals[:phone_number])
        raise_user_specific_error(user)

        user&.send_phone_token

        { user: user }
      end

      private

      # Raises GraphQL execution error if phone number is blank
      #
      # @param phone_number [String]
      #
      # @return [GraphQL::ExecutionError]
      def raise_phone_number_blank_error(phone_number)
        return if phone_number.present?

        raise GraphQL::ExecutionError, I18n.t('errors.phone_number.found_blank')
      end

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_specific_error(user)
        message = I18n.t('errors.user.not_found') if user.nil?
        message = I18n.t('errors.user.cannot_access_app') if user&.deactivated?

        return if message.blank?

        raise GraphQL::ExecutionError, message
      end
    end
  end
end
