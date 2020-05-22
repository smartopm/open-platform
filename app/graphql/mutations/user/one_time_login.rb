# frozen_string_literal: true

module Mutations
  module User
    # Sends a one time login to the users phone
    class OneTimeLogin < BaseMutation
      argument :user_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false
      field :url, GraphQL::Types::String, null: false

      def resolve(vals)
        user = ::User.find(vals[:user_id])
        raise GraphQL::ExecutionError, 'NotFound' unless user

        url = user.send_one_time_login
        {
          url: url,
          success: true,
        }
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user.role?([:admin, :client, :resident])

        true
      end
    end
  end
end
