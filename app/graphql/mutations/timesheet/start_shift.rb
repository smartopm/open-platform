# frozen_string_literal: true

module Mutations
  module Timesheet
    # Create timesheet record
    class StartShift < BaseMutation
      argument :user_id, ID, required: true
      argument :start_date, String, required: true

      field :event_log, Types::EventLogType, null: true

      def resolve(user_id:, start_date:)
        user = ::User.find(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        event_log = log_user_shift(context[:current_user], user, start_date)

        return { event_log: event_log } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def log_user_shift(current_user, user, start_date)
        EventLog.new(acting_user_id: current_user.id,
                     community_id: user.community_id, subject: 'user_shift',
                     ref_id: user.id,
                     ref_type: 'User',
                     data: {
                       ref_name: user.name,
                       type: user.user_type,
                       shift: { start_date: start_date, end_date: nil },
                     })
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.custodian?

        true
      end
    end
  end
end
