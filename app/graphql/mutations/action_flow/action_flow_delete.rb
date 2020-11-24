# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Delete an action flow
    class ActionFlowDelete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        flow_delete = context[:site_community].action_flows.find_by(id: id)
        raise GraphQL::ExecutionError, 'Action Flow not found' if flow_delete.nil?

        return { success: true } if flow_delete.update(status: 'deleted')
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
