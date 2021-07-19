# frozen_string_literal: true

module Mutations
  module Login
    # Complete the phone number login
    class LoginPhoneComplete < BaseMutation
      argument :id, ID, required: true
      argument :token, String, required: true

      field :auth_token, String, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:id])
        if user.present?
          auth_token = user.auth_token if user.verify_phone_token!(vals[:token])
          user.generate_events('user_login', user)
          return { auth_token: auth_token } if auth_token
        end

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
