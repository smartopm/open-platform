

module Mutations
  module Login
    # Complete the phone number login
    class LoginPhoneComplete < BaseMutation
      argument :phone_number, String, required: true
      argument :token, String, required: true

      field :auth_token, String, null: true

      def resolve(vals)
        user = User.find_via_phone_number(vals[:phone_number])
        auth_token = user.auth_token if user.verify_phone_token!(vals[:token])

        return { auth_token: auth_token } if auth_token

        raise GraphQL::ExecutionError, 'Unauthorized'

      end

    end
  end
end
