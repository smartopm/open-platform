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
        raise GraphQL::ExecutionError, I18n.t('errors.post_tag.not_found') if tag.nil?

        return { post_tag_user: tag } if tag.follow_or_unfollow_tag(user_id)

        raise GraphQL::ExecutionError, tag.errors.full_messages
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
