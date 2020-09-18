# frozen_string_literal: true

module Mutations
  module Comment
    # Update a Comment
    class CommentUpdate < BaseMutation
      argument :comment_id, ID, required: true
      argument :discussion_id, ID, required: true

      field :success, String, null: false

      def resolve(comment_id:, discussion_id:)
        comment = ::Comment.find_by(id: comment_id, discussion_id: discussion_id)

        raise GraphQL::ExecutionError, 'NotFound' unless comment

        response = comment.update!(status: 'deleted')

        return { success: 'updated' } if response

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      def authorized?(vals)
        disc = context[:site_community].discussions.find(vals[:discussion_id])
        current_user = context[:current_user]
        # make sure the discussion is in same community as the admin updating it
        check_community = disc.community_id == current_user.community_id
        raise GraphQL::ExecutionError, 'Unauthorized' unless check_community && current_user&.admin?

        true
      end
    end
  end
end
