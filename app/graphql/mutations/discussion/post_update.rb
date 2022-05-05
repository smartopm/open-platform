# frozen_string_literal: true

module Mutations
  module Discussion
    # Updates Post
    class PostUpdate < BaseMutation
      argument :id, ID, required: true
      argument :content, String, required: false

      field :post, Types::PostType, null: false

      def resolve(id:, content:)
        post = context[:site_community].posts.find(id)
        return { post: post } if post.update(content: content)

        raise_error_message(post.errors.full_messages&.join(', '))
      end

      def authorized?(vals)
        return true if user_authorized?(vals[:id])

        raise_error_message(I18n.t('errors.unauthorized'))
      end

      def user_authorized?(id)
        permitted?(module: :discussion, permission: :can_update_post) ||
          post_user_verified?(id)
      end

      def post_user_verified?(id)
        post = context[:site_community].posts.find(id)
        post.user_id == context[:current_user].id
      end
    end
  end
end
