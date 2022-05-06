# frozen_string_literal: true

module Mutations
  module Discussion
    # Deletes Post
    class PostDelete < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: false

      def resolve(id:)
        post = context[:site_community].posts.find(id)
        return { success: true } if post.deleted!

        raise_error_message(post.errors.full_messages&.join(', '))
      end

      def authorized?(vals)
        return true if user_authorized?(vals[:id])

        raise_error_message(I18n.t('errors.unauthorized'))
      end

      def user_authorized?(id)
        permitted?(module: :discussion, permission: :can_delete_post) ||
          post_user_verified?(id)
      end

      def post_user_verified?(id)
        post = context[:site_community].posts.find(id)
        post.user_id == context[:current_user].id
      end
    end
  end
end
