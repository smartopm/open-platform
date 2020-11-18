# frozen_string_literal: true

module Mutations
  module ActionFlow
    # Delete an action flow
    class ActionFlowDelete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
       
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
