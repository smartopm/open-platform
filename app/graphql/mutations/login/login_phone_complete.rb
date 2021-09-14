# frozen_string_literal: true

module Mutations
  module Login
    # Complete the phone number login
    class LoginPhoneComplete < BaseMutation
      argument :id, ID, required: true
      argument :token, String, required: true

      field :auth_token, String, null: true

      def resolve(vals)
        user = context[:site_community].users.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless user

        auth_token = user.auth_token if user.verify_phone_token!(vals[:token])
        raise GraphQL::ExecutionError, 'Invalid token' unless auth_token

        user.generate_events('user_login', user)
        { auth_token: auth_token }
      end
    end
  end
end
