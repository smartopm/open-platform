# frozen_string_literal: true

module Mutations
  module User
    # Sends a one time login to the users phone
    class OneTimeLogin < BaseMutation
      argument :user_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false
      field :url, GraphQL::Types::String, null: false

      def resolve(vals)
        user = Users::User.find(vals[:user_id])
        raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless user

        url = user.send_one_time_login
        {
          url: url,
          success: true,
        }
      end

      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          module: :user,
          permission: :one_time_login,
        ) || context[:current_user].role?(%i[admin client resident])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
