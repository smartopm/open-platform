# frozen_string_literal: true

module Mutations
  module User
    # Sends a one time login to the users phone
    class OneTimeLogin < BaseMutation
      argument :user_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false
      field :url, GraphQL::Types::String, null: false

      def resolve(vals)
        user = Users::User.find(vals[:user_id])
        raise_user_specific_error(user)
        url = user.send_one_time_login
        {
          url: url,
          success: true,
        }
      end

      def authorized?(_vals)
        return true if permitted?(module: :user, permission: :can_send_one_time_login)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      def raise_user_specific_error(user)
        message = I18n.t('errors.user.not_found') if user.nil?
        message = I18n.t('errors.user.cannot_send_otp_link') if user&.deactivated?

        return if message.blank?

        raise GraphQL::ExecutionError, message
      end
    end
  end
end
