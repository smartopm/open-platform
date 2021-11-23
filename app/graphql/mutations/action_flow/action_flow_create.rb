# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Add an action flow
    class ActionFlowCreate < BaseMutation
      argument :title, String, required: true
      argument :description, String, required: true
      argument :event_type, String, required: true
      argument :event_condition, String, required: false
      argument :event_condition_query, String, required: false
      argument :event_action, GraphQL::Types::JSON, required: false

      field :action_flow, Types::ActionFlowType, null: false

      def resolve(vals)
        vals[:event_condition] = '{"==":[1,1]}' if vals[:event_condition].blank?
        action_flow = ActionFlows::ActionFlow.new(
          vals.merge(status: 'active', community: context[:site_community]),
        )
        return { action_flow: action_flow } if action_flow.save

        raise GraphQL::ExecutionError, action_flow.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :action_flow,
                                  permission: :can_create_action_flow)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
