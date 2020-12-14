# frozen_string_literal: true

module Mutations
  module ContactInfo
    # Remove secondary contact info of user
    class Delete < BaseMutation
      argument :user_id, ID, required: true
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(user_id:, id:)
        user = context[:site_community].users.find(user_id)
        return { success: false } if user.nil?

        info = user.contact_infos.find(id)
        return { success: true } if info.destroy

        raise GraphQL::ExecutionError, info.errors.full_messages
      end

      def authorized?(vals)
        return true if context[:current_user]&.admin? ||
                       context[:current_user]&.id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
