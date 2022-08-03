# frozen_string_literal: true

module Mutations
  module Discussion
    # Updates Post
    class PostUpdate < BaseMutation
      include ::PostHelper

      argument :id, ID, required: true
      argument :content, String, required: false
      argument :accessibility, String, required: false

      field :post, Types::PostType, null: false

      def resolve(vals)
        post = context[:site_community].posts.find(vals[:id])
        return { post: post } if post.update(vals.except(:id))

        raise_error_message(post.errors.full_messages&.join(', '))
      end

      def authorized?(vals)
        permitted = permitted?(module: :discussion, permission: :can_update_post)
        return true if permitted || user_authorized?(vals)

        raise_error_message(I18n.t('errors.unauthorized'))
      end
    end
  end
end
