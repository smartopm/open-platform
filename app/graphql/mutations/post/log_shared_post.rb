# frozen_string_literal: true

module Mutations
  module Post
    # Add a log for a post shared by a user
    class LogSharedPost < BaseMutation
      argument :post_id, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(post_id:)
        user = context[:current_user]

        return unless user

        event_log = user.generate_events('post_shared', user, post_id: post_id,
                                                              type: user.user_type)
        return unless event_log

        raise GraphQL::ExecutionError, event_log.errors.full_messages unless event_log.persisted?

        { event_log: event_log }
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
