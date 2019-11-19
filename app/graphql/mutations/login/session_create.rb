

module Mutations
  module Login
    # Create a new request/pending member
    class LoginPhoneStart < BaseMutation
      argument :phone_number, String, required: true

      field :success, Boolean, null: true

      def resolve(vals)
        user = User.find_via_phone_number(vals[:phone_number])
        user.send_phone_token if user

        return { success: !!user }

      end

    end
  end
end
