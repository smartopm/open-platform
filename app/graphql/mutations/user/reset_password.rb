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
        user = Users::User.find(vals[:user_id])

        Logs::EventLog.skip_callback(:commit, :after, :execute_action_flows)
        user.update!(username: vals[:username], password: vals[:password])
        eventlog = context[:current_user].generate_events('password_reset', user)
        ActionFlowJob.perform_later(eventlog, { password: vals[:password] })
        {
          success: true,
        }
      end

      def authorized?(_vals)
        return true if permitted?(module: :user, permission: :can_reset_user_password)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
