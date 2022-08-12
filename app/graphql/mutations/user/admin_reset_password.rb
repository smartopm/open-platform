# frozen_string_literal: true

module Mutations
  module User
    # Reset user password and username
    class AdminResetPassword < BaseMutation
      argument :user_id, ID, required: true

      field :username, GraphQL::Types::String, null: true
      field :password, GraphQL::Types::String, null: true

      def resolve(vals)
        validate_authorization(:user, :can_reset_user_password)
        user = Users::User.find(vals[:user_id])
        password = SecureRandom.alphanumeric

        unless user.update(username: username(user), password: password,
                           has_reset_password: false)
          raise GraphQL::ExecutionError, user.errors.full_messages&.join(', ')
        end

        eventlog = context[:current_user].generate_events('password_reset', user)
        ActionFlowJob.perform_later(eventlog, { password: password })
        { username: user.username, password: password }
      end

      def username(user)
        if user.username.nil?
          user.name.split
              .join.downcase << SecureRandom.uuid.slice(0, 3)
        else
          user.username
        end
      end
    end
  end
end
