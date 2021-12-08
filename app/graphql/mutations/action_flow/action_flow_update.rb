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
      argument :event_condition_query, String, required: false
      argument :event_action, GraphQL::Types::JSON, required: false

      field :action_flow, Types::ActionFlowType, null: false

      def resolve(vals)
        action_flow = context[:site_community].action_flows.find(vals[:id])
        return { action_flow: action_flow } if action_flow.update(vals.except(:id))

        raise GraphQL::ExecutionError, action_flow.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :action_flow,
                                  permission: :can_update_action_flow)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
