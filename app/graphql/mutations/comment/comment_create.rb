# frozen_string_literal: true

module Mutations
  module Comment
    IMAGE_ATTACHMENTS = {
      image_blob_id: :image,
    }.freeze
    # Create a new Comment
    class CommentCreate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :content, String, required: true
      argument :image_blob_id, String, required: false

      field :comment, Types::CommentType, null: true

      # refactor this
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        comment = context[:current_user].comments.new(
          discussion_id: vals[:discussion_id],
          content: vals[:content],
          community_id: context[:site_community].id,
        )
        attach_image(comment, vals)
        comment.save!

        return { comment: comment } if comment.persisted?

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      def attach_image(comt, vals)
        IMAGE_ATTACHMENTS.each_pair do |key, attr|
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
