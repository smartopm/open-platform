# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Delete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        user = context[:site_community].users.find(:id)

        { success: user.destroy }
      end

      def authorized?(vals)
        current_user = context[:current_user]
        user_record = context[:site_community].users.find(vals[:id])
        authorized = current_user&.admin? && user_record.community_id == current_user.community_id
        raise GraphQL::ExecutionError, 'Unauthorized' unless authorized
        raise GraphQL::ExecutionError, 'Can\'t delete self' if current_user.id == user_record.id

        true
      end
    end
  end
end
