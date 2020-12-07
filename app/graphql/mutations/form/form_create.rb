# frozen_string_literal: true

module Mutations
  module Form
    # For creating a Form
    class FormCreate < BaseMutation
      argument :name, String, required: true
      argument :expires_at, String, required: true
      argument :description, String, required: false

      field :form, Types::FormType, null: true

      def resolve(vals)
        form = context[:site_community].forms.new(vals)
        if form.save
          context[:current_user].generate_events('form_create', form)
          
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
