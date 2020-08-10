# frozen_string_literal: true

module Mutations
  module Discussion
    # Create a new Discussion
    class DiscussionCreate < BaseMutation
      argument :title, String, required: true
      argument :description, String, required: false
      argument :post_id, String, required: false

      field :discussion, Types::DiscussionType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        # TODO: ==> Find a better way of doing this
        if vals[:post_id] && context[:current_user].user_type != 'admin'
          raise GraphQL::ExecutionError, 'Not authorized to create post discussions'
        end

        discussion = context[:site_community].discussions.new(vals)
        discussion.user_id = context[:current_user].id

        discussion.save!

        return { discussion: discussion } if discussion.persisted?

        raise GraphQL::ExecutionError, discussion.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        current_user = context[:current_user]
        authorized = %w[admin resident client].include?(current_user.user_type)
        raise GraphQL::ExecutionError, 'Unauthorized' unless authorized

        true
      end
    end
  end
end
