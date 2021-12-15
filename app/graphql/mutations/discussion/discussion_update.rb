# frozen_string_literal: true

module Mutations
  module Discussion
    # Update a Discussion
    class DiscussionUpdate < BaseMutation
      argument :discussion_id, ID, required: true
      argument :status, String, required: true

      field :success, String, null: false

      def resolve(vals)
        discussion = context[:site_community].discussions.find(vals[:discussion_id])
        raise_discussion_not_found_error(discussion)

        response = discussion.update(status: vals[:status])

        return { success: I18n.t('response.updated') } if response

        raise GraphQL::ExecutionError, discussion.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :discussion, permission: :can_update_discussion)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if discussion does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_discussion_not_found_error(discussion)
        return if discussion

        raise GraphQL::ExecutionError, I18n.t('errors.not_found')
      end
    end
  end
end
