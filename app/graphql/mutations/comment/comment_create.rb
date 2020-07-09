# frozen_string_literal: true

module Mutations
  module Comment
    # Create a new Comment
    class CommentCreate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :content, String, required: true

      field :comment, Types::CommentType, null: true

      # refactor this
      def resolve(vals)
        comment = context[:current_user].comments.new
        comment.discussion_id = vals[:discussion_id]
        comment.content = vals[:content]
        comment.save!

        return { comment: comment } if comment.persisted?

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
