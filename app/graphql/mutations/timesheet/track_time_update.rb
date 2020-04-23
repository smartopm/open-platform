# frozen_string_literal: true

module Mutations
    module Timesheet
      # update time tracking
      class TrackTimeUpdate < BaseMutation
        argument :log_id, ID, required: true
  
        field :event_log, Types::EventLogType, null: true
  
        def resolve(log_id:, end_date: nil)
            event_log = ::EventLog.find(log_id)
            raise GraphQL::ExecutionError, 'Event not found' unless event_log

            event_log.data['shift']['end_date'] = Time.now 
          return { event_log: event_log } if event_log.save
  
          raise GraphQL::ExecutionError, event_log.errors.full_messages
        end

        # TODO: update admin ==> custodian when role is implemented
        def authorized?(_vals)
          current_user = context[:current_user]
          raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?
  
          true
        end
      end
    end
  end
  