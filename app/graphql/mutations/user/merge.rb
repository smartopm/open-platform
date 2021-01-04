# frozen_string_literal: true

module Mutations
  module User
    # merge users
    class Merge < BaseMutation
      argument :id, ID, required: true
      argument :duplicate_id, ID, required: true

      field :success, Boolean, null: true

      def resolve(id:, duplicate_id:)
        user = context[:site_community].users.find(id)
        raise GraphQL::ExecutionError, 'NotFound' unless user

        begin
          user.merge_user(duplicate_id)
          { success: true }
        rescue StandardError
          raise GraphQL::ExecutionError, 'Merge Failed'
        end
      end

      def authorized?(vals)
        user_record = context[:site_community].users.find_by(id: vals[:id])
        current_user = context[:current_user]
        comm_user = user_record&.community_id == current_user.community_id
        raise GraphQL::ExecutionError, 'Unauthorized' unless comm_user && current_user&.admin?

        true
      end
    end
  end
end
