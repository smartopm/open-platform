# frozen_string_literal: true

module Mutations
  module Form
    # For adding form users
    class FormUserCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: true
      argument :status, String, required: false

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise GraphQL::ExecutionError, 'Form not found' if form.nil?

        form_user = form.form_users.new(vals)
        return { form_user: form_user } if form_user.save

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
