# frozen_string_literal: true

module Mutations
  module Discussion
    # Update a Discussion
    class DiscussionUpdate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :status, String, required: true

      field :success, String, null: false

      def resolve(vals)
        discussion = context[:site_community].discussions.find(vals[:discussion_id])

        raise GraphQL::ExecutionError, 'NotFound' if discussion.blank?

        response = discussion.update!(status: vals[:status])

        return { success: 'updated' } if response

        raise GraphQL::ExecutionError, discussion.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
