# frozen_string_literal: true

module Mutations
  module Form
    # For Updating a Form
    class FormUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :expires_at, String, required: false

      field :form, Types::FormType, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:id])
        return { form: form } if form.update(vals.except(:id))

        raise GraphQL::ExecutionError, form.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
