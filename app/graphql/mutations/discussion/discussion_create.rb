# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Discussion
    class DiscussionCreate < BaseMutation
      argument :post_id, String, required: true
      argument :title, String, required: true
      argument :description, String, required: false

      field :discussion, Types::DiscussionType, null: true

      def resolve(vals)
        discussion = context[:current_user].community.discussions.new
        discussion.post_id = vals[:post_id]
        discussion.title = vals[:title]
        discussion.description = vals[:description]
        discussion.save!

        return { discussion: discussion } if discussion.persisted?

        raise GraphQL::ExecutionError, discussion.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
