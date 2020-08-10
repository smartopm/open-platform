# frozen_string_literal: true

module Mutations
  module Comment
    ATTACHMENTS = {
      image_blob_id: :avatar,
    }.freeze

    # Create a new Comment
    class CommentCreate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :content, String, required: true
      argument :image_blob_id, String, required: false

      field :comment, Types::CommentType, null: true

      # refactor this
      def resolve(vals)
        comment = context[:current_user].comments.new(vals.except(*ATTACHMENTS.keys))

        attach_avatars(comment, vals)

        comment.save!

        return { comment: comment } if comment.persisted?

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      def attach_avatars(comt, vals)
        ATTACHMENTS.each_pair do |key, attr|
          comt.send(attr).attach(vals[key]) if vals[key]
        end
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
