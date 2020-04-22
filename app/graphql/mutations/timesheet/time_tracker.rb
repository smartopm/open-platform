# frozen_string_literal: true

module Mutations
  module TimeSheet
    # Create a new request/pending member
    class TrackTime < BaseMutation
      argument :user_id, ID, required: true
      argument :start_date, String, required: false
      argument :end_date, String, required: false

      field :event_log, Types::EventLogType, null: true

      def resolve(user_id:, start_date:, end_date:)
        user = ::User.find(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        event_log = instantiate_event_log(context[:current_user], user, start_date, end_date)

        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def instantiate_event_log(current_user, user)
        EventLog.new(acting_user_id: current_user.id,
                     community_id: user.community_id, subject: 'user_shift',
                     ref_id: user.id,
                     ref_type: 'User',
                     data: {
                       ref_name: user.name,
                       type: user.user_type,
                       shift: { start_date: start_date, end_date: end_date },
                     })
      end
    end
  end
end
