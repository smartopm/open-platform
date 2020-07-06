# frozen_string_literal: true

module Mutations
  module DiscussionUsesr
    # Create a new Discussion user with discussion ID, this will be used on follow button
    class DiscussionUserCreate < BaseMutation
      argument :discussion_id, ID, required: false

      field :discussion_user, Types::DiscussionUserType, null: true

      def resolve(discussion_id:)
        discussion_user = context[:current_user].discussion_user.new(
            discussion_id: discussion_id
        )
        discussion_user.save!

        return { discussion_user: discussion_user } if discussion_user.persisted?

        raise GraphQL::ExecutionError, discussion_user.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
