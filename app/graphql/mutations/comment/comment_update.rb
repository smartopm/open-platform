# frozen_string_literal: true

module Mutations
  module Comment
    # Update a Comment
    class CommentUpdate < BaseMutation
      argument :comment_id, ID, required: true
      argument :discussion_id, ID, required: true
      argument :status, String, required: true

      field :success, String, null: false

      def resolve(comment_id:, discussion_id:, status:)
        comment = Comments::Comment.find_by(id: comment_id, discussion_id: discussion_id)

        raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless comment

        response = comment.update!(status: status)

        return { success: I18n.t('response.updated') } if response

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(vals)
        disc = context[:site_community].discussions.find(vals[:discussion_id])
        current_user = context[:current_user]
        # make sure the discussion is in same community as the admin updating it
        check_community = disc.community_id == current_user.community_id
        return true if check_community && current_user&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
