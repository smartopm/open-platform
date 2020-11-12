# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Update an action flow
    class ActionFlowUpdate < BaseMutation
      argument :id, ID, required: true
      argument :title, String, required: false
      argument :description, String, required: false
      argument :event_type, String, required: false
      argument :event_condition, String, required: false
      argument :event_action, GraphQL::Types::JSON, required: false

      field :action_flow, Types::ActionFlowType, null: false

      def resolve(vals)
        action_flow = context[:site_community].action_flows.find(vals[:id])
        return { action_flow: action_flow } if action_flow.update(vals.except(:id))

        raise GraphQL::ExecutionError, action_flow.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
