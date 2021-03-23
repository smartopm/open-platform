# frozen_string_literal: true

module Mutations
  module SubstatusLog
    # Update a SubstatusLog
    class SubstatusLogUpdate < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true
      argument :start_date, String, required: true
      argument :stop_date, String, required: false
      argument :previous_status, String, required: false

      field :log, Types::SubstatusLogType, null: true

      def resolve(vals)
        user = context[:site_community].users.find_by(id: vals[:user_id])
        raise GraphQL::ExecutionError, 'User not found' if user.nil?

        user_log = user.substatus_logs.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Substatus log not found' if user_log.nil?

        if user_log.update(vals)
          update_previous(user_log, user, vals[:start_date])
          return { log: user_log }
        end
        raise GraphQL::ExecutionError, user_log.errors.full_messages
      end

      # stopdate will be the startdate for the recent log, if there is no prevlog then we move on
      def update_previous(log, user, start_date)
        prev_log = user.substatus_logs.previous_log(log.created_at)
        return if prev_log.nil?

        # raise GraphQL::ExecutionError, 'Date can\'t be less than the previous log start date' if start_date < prev_log.start_date

        prev_log.update(stop_date: start_date)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
