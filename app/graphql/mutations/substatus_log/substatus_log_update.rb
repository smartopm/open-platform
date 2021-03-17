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
          return { log: log } if log.update(vals)

          raise GraphQL::ExecutionError, log.errors.full_messages
        end
  
        def authorized?(_vals)
          return true if context[:current_user]&.admin?
  
          raise GraphQL::ExecutionError, 'Unauthorized'
        end
      end
    end
  end
  