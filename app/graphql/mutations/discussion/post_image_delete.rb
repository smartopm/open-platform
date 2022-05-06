# frozen_string_literal: true

module Mutations
  module Discussion
    # deletes post image on discussion
    class PostImageDelete < BaseMutation
      argument :image_id, ID, required: true

      field :success, Boolean, null: false

      def resolve(image_id:)
        image = ActiveStorage::Attachment.find(image_id)
        return { success: true } if image.update(status: 1)

        raise_error_message(image.errors.full_messages&.join(', '))
      end

      def authorized?(image_id:)
        return true if user_authorized?(image_id)

        raise_error_message(I18n.t('errors.unauthorized'))
      end

      def user_authorized?(image_id)
        permitted?(module: :discussion, permission: :can_delete_post_image) ||
          post_user_verified?(image_id)
      end

      def post_user_verified?(image_id)
        image = ActiveStorage::Attachment.find(image_id)
        image.record.user_id == context[:current_user].id
      end
    end
  end
end
