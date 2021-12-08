# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Delete an action flow
    class ActionFlowDelete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        flow = context[:site_community].action_flows.find_by(id: id)
        raise_af_not_found_error(flow)

        return { success: true } if flow.update(status: 'deleted')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :action_flow,
                                  permission: :can_delete_action_flow)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if Action flow not found.
      #
      # @return [GraphQL::ExecutionError]
      def raise_af_not_found_error(flow)
        return unless flow.nil?

        raise GraphQL::ExecutionError,
              I18n.t('errors.action_flow.not_found')
      end
    end
  end
end
