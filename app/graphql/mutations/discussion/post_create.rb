# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Post
    class PostCreate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :content, String, required: false
      argument :image_blob_ids, [String], required: false
      argument :accessibility, String, required: false

      field :post, Types::PostType, null: false

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        raise_content_empty_error(vals)
        # TODO: Find a better way to differentiate between 'Community News' and others
        discussions = context[:site_community].discussions
        discussion = discussions.find_by(id: vals[:discussion_id]) ||
                     discussions.find_by(title: 'Community News')

        unless discussion
          raise GraphQL::ExecutionError, I18n.t('errors.general.model_not_found',
                                                model: 'Discussion')
        end

        post = discussion.posts.create(vals.except(:image_blob_ids)
                               .merge(user_id: context[:current_user].id,
                                      community_id: context[:site_community].id))

        raise_error_message(post.errors.full_messages&.join(', ')) unless post.persisted?

        attach_image(post, vals) if vals [:image_blob_ids].present?

        { post: post }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def attach_image(post, vals)
        vals[:image_blob_ids].each do |image_blob_id|
          post.images.attach(image_blob_id)
        end
      end

      def raise_content_empty_error(vals)
        return unless vals[:image_blob_ids].nil? && vals[:content].blank?

        raise_error_message(I18n.t('errors.post.content_not_found'))
      end

      def authorized?(vals)
        return true if user_authorized?(vals[:accessibility])

        raise_error_message(I18n.t('errors.unauthorized'))
      end

      def user_authorized?(accessibility)
        can_create_post = permitted?(module: :discussion, permission: :can_create_post)
        return can_create_post if accessibility.blank?

        can_create_post && permitted?(module: :discussion, permission: :can_set_accessibility)
      end
    end
  end
end
