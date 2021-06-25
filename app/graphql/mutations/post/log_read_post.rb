# frozen_string_literal: true

module Mutations
  module Post
    # Add a log for a post read by a user
    class LogReadPost < BaseMutation
      argument :post_id, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(post_id:)
        user = context[:current_user]

        return unless user

        event_log = unless post_already_read?(user, post_id)
                      user.generate_events('post_read', user, post_id: post_id,
                                                              type: user.user_type)
                    end

        return unless event_log

        raise GraphQL::ExecutionError, event_log.errors.full_messages unless event_log.persisted?

        { event_log: event_log }
      end

      def post_already_read?(user, post_id)
        Logs::EventLog.post_read_by_acting_user(user)
                      .where(ActiveRecord::Base.sanitize_sql("data ->> 'post_id' = '#{post_id}'"))
                      .exists?
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
