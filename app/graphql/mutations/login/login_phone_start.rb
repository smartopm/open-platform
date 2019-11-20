# frozen_string_literal: true

module Mutations
  module Login
    # Start a phone login
    class LoginPhoneStart < BaseMutation
      argument :phone_number, String, required: true

      field :user, Types::UserType, null: true

      def resolve(vals)
        user = User.find_via_phone_number(vals[:phone_number])
        user&.send_phone_token

        { user: user }
      end
    end
  end
end
