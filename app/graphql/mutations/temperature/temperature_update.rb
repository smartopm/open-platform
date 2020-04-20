# frozen_string_literal: true

module Mutations
    module Temperature
      # Create an event for temperature record
      class TemperatureUpdate < BaseMutation
        argument :temp, Integer, required: true
        argument :user_id, ID, required: true
  
        field :event_log, Types::EventLogType, null: true
  
        def resolve(vals)
            user = ::User.find(vals[:user_id])
            raise GraphQL::ExecutionError, 'User not found' unless user

            event_log = ::EventLog.create(acting_user_id: context[:current_user].id,
                community_id: user.community_id, subject: 'user_temp',
                ref_id: user.id,
                ref_type: 'User',
                data: {
                    ref_name: user.name,
                    note: vals[:temp],
                    type: user.user_type,
                })
        return { event_log: event_log, user: user } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
        end
  
        # TODO: Better auth here
        def authorized?(_vals)
          current_user = context[:current_user]
          raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?
  
          true
        end
      end
    end
  end
  