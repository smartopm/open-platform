# frozen_string_literal: true

module Mutations
  module Post
    # Create a new PostTag user with PostTag ID, this will be used on follow tag button
    class FollowPostTag < BaseMutation
      argument :tag_name, String, required: true

      field :post_tag_user, Types::PostTagUserType, null: true

      def resolve(vals)
        user_id = context[:current_user].id
        tag = context[:site_community].post_tags.find_by(name: vals[:tag_name])
        raise GraphQL::ExecutionError, 'Tag not found' if tag.nil?

        return { post_tag_user: tag } if tag.follow_or_unfollow_tag(user_id)

        raise GraphQL::ExecutionError, tag.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
