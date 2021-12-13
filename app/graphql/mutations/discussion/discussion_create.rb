# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Discussion
    class DiscussionCreate < BaseMutation
      argument :title, String, required: true
      argument :description, String, required: false
      argument :post_id, String, required: false

      field :discussion, Types::DiscussionType, null: true
      def resolve(vals)
        discussion = context[:site_community].discussions.new(vals)
        discussion.user_id = context[:current_user].id

        discussion.save!

        return { discussion: discussion } if discussion.persisted?

        raise GraphQL::ExecutionError, discussion.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :discussion, permission: :can_create_discussion)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
