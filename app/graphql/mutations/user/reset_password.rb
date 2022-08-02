# frozen_string_literal: true

module Mutations
  module User
    # Reset user password and username
    class ResetPassword < BaseMutation
      argument :user_id, ID, required: true
      argument :username, String, required: true
      argument :password, String, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        validate_authorization(:user, :can_reset_user_password)
        user = Users::User.find(vals[:user_id])
        user.update!(username: vals[:username], password: vals[:password])
        eventlog = context[:current_user].generate_events('password_reset', user)
        ActionFlowJob.perform_later(eventlog, { password: vals[:password] })
        {
          success: true,
        }
      end
    end
  end
end
