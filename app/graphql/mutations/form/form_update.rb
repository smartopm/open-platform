# frozen_string_literal: true

module Mutations
  module Form
    # For Updating a Form
    class FormUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :status, String, required: false
      argument :description, String, required: false
      argument :expires_at, String, required: false

      field :form, Types::FormType, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:id])
        if vals[:status] == 'delete'
          # find the task and delete it
          FormUser.find_by(form_id: vals[:id]).note.update(flagged: false)
        end
        if form.update(vals.except(:id))
          context[:current_user].generate_events('form_publish', form, action: vals[:status])

          return { form: form }
        end

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
