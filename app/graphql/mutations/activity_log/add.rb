# frozen_string_literal: true

module Mutations
  module ActivityLog
    # Add an activity log for a user
    class Add < BaseMutation
      argument :user_id, ID, required: true
      argument :note, String, required: false

      field :user, Types::UserType, null: true
      field :event_log, Types::EventLogType, null: true

      def resolve(user_id:, note: nil)
        user = ::User.find(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        event_log = instantiate_event_log(context[:current_user], user, note)

        return { event_log: event_log, user: user } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def instantiate_event_log(current_user, user, note)
        EventLog.new(acting_user_id: current_user.id,
                     community_id: user.community_id, subject: 'user_entry',
                     ref_id: user.id,
                     ref_type: 'User',
                     data: {
                       ref_name: user.name, note: note
                     })
      end
    end
  end
end
