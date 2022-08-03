# frozen_string_literal: true

module Mutations
  module Discussion
    # Deletes Post
    class PostDelete < BaseMutation
      include ::PostHelper

      argument :id, ID, required: true

      field :success, Boolean, null: false

      def resolve(id:)
        post = context[:site_community].posts.find(id)
        return { success: true } if post.deleted!

        raise_error_message(post.errors.full_messages&.join(', '))
      end

      def authorized?(vals)
        permitted = permitted?(module: :discussion, permission: :can_delete_post)
        return true if permitted || user_authorized?(vals)

        raise_error_message(I18n.t('errors.unauthorized'))
      end
    end
  end
end
