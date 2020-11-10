# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Add an action flow
    class ActionFlowCreate < BaseMutation
      argument :title, String, required: true
      argument :description, String, required: true
      argument :event_type, String, required: true
      argument :event_condition, String, required: false
      argument :event_action, GraphQL::Types::JSON, required: false

      field :action_flow, Types::ActionFlowType, null: false

      def resolve(vals)
        vals[:event_condition] = '{"==":[1,1]}' if vals[:event_condition].blank?
        action_flow = ::ActionFlow.new(vals)
        return { action_flow: action_flow } if action_flow.save

        raise GraphQL::ExecutionError, action_flow.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user
      end
    end
  end
end
