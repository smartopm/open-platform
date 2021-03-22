# frozen_string_literal: true

module Mutations
  module SubstatusLog
    # Update a SubstatusLog
    class SubstatusLogUpdate < BaseMutation
      argument :id, ID, required: true
      argument :start_date, String, required: true
      argument :stop_date, String, required: true
      argument :previous_status, String, required: false

      field :log, Types::SubstatusLogType, null: true

      def resolve(vals)
        log = context[:site_community].substatus_logs.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Substatus log not found' if log.nil?

        if log.update(vals)
          update_previous(vals[:previous_status], vals[:start_date])
          return { log: log }
        end
        raise GraphQL::ExecutionError, log.errors.full_messages
      end

      # stopdate will be the startdate for the recent log, if there is no prevlog then we move on
      def update_previous(prev_status, stop_date)
        # TODO: Find substatus_logs for the user not the community
        # TODO: Fix: if there are multiple previous states then it will probably pick the wrong one
        prev_log = context[:site_community].substatus_logs.find_by(previous_status: prev_status)
        return if prev_log.nil?

        prev_log.update(stop_date: stop_date)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
