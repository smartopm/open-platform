# frozen_string_literal: true

module Mutations
  module Login
    # Complete the phone number login
    class LoginSwitchUser < BaseMutation
      argument :id, ID, required: true

      field :auth_token, String, null: true

      def resolve(vals)
        ensure_logged_in
        user = ::User.find(vals[:id])

        unless context[:current_user].can_become?(user)
          raise GraphQL::ExecutionError, 'Unauthorized'
        end

        log(context[:current_user], user)

        { auth_token: user.auth_token }
      end

      def ensure_logged_in
        user = context[:current_user]
        raise GraphQL::ExecutionError, 'Must be logged in' unless user
      end

      def log(from_user, to_user)
        EventLog.create(
          acting_user: from_user, community: from_user.community,
          subject: 'user_switch',
          ref_id: to_user.id, ref_type: 'User'
        )
      end
    end
  end
end
