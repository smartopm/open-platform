# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Discussion user with discussion ID, this will be used on follow button
    class DiscussionUserCreate < BaseMutation
      argument :discussion_id, ID, required: false

      field :discussion_user, Types::DiscussionUserType, null: true

      def resolve(vals)
        user_id = context[:current_user]
        # rubocop:disable LineLength
        discussion_user = context[:site_community].discussions.find(vals[:discussion_id])
                                                  .follow_or_unfollow_discussion(user_id, vals[:discussion_id])
        # rubocop:enable LineLength
        return { discussion_user: discussion_user } if discussion_user.errors.blank?

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
