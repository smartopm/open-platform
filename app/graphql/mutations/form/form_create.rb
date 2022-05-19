# frozen_string_literal: true

module Mutations
  module Form
    # For creating a Form
    class FormCreate < BaseMutation
      argument :name, String, required: true
      argument :expires_at, String, required: false
      argument :description, String, required: false
      argument :preview, Boolean, required: true
      argument :is_public, Boolean, required: true
      argument :multiple_submissions_allowed, Boolean, required: true
      argument :has_terms_and_conditions, Boolean, required: true
      argument :roles, [String, { null: true }], required: false

      field :form, Types::FormType, null: true

      def resolve(vals)
        form = context[:site_community].forms.new(vals)
        if form.save
          context[:current_user].generate_events('form_create', form)
          form.update!(grouping_id: form.id)
          return { form: form }
        end

        raise GraphQL::ExecutionError, form.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_create_form)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
