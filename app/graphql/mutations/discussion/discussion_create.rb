# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Discussion
    class DiscussionCreate < BaseMutation
      argument :title, String, required: true
      argument :description, String, required: false
      argument :post_id, String, required: false

      field :discussion, Types::DiscussionType, null: true
      def resolve(vals)
        discussion = context[:site_community].discussions.new(vals)
        discussion.user_id = context[:current_user].id

        discussion.save!

        return { discussion: discussion } if discussion.persisted?

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
