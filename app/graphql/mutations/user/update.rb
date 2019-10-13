# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Update < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false

      field :user, Types::UserType, null: true

      def resolve(vals)
        user = ::User.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless user

        return { user: user } if user.update(vals)

        raise GraphQL::ExecutionError, member.errors.full_messages
      end

      def authorized?(vars)
        user_record = ::User.find(vars[:id])
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user.admin? &&
                                                             user_record.community_id ==
                                                             current_user.community_id

        true
      end
    end
  end
end
