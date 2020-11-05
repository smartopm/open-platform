# frozen_string_literal: true

module Mutations
  module Form
    # For updating status of form users
    class FormUserStatusUpdate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: true
      argument :status, String, required: true

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        user = context[:current_user]
        form_user = user.user_form(vals[:form_id], vals[:user_id])
        raise GraphQL::ExecutionError, 'Record not found' if form_user.nil?

        return { form_user: form_user } if form_user.update(status: vals[:status],
                                                            status_updated_by: user)

        raise GraphQL::ExecutionError, form_user.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
