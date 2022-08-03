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
      argument :preview, Boolean, required: false
      argument :is_public, Boolean, required: false
      argument :multiple_submissions_allowed, Boolean, required: false
      argument :has_terms_and_conditions, Boolean, required: false
      argument :roles, [String, { null: true }], required: false

      field :form, Types::FormType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        form = context[:site_community].forms.find(vals[:id])
        ActiveRecord::Base.transaction do
          update_tasks(form) if vals[:status] == 'deleted'
          if form.update!(vals.except(:id))
            context[:current_user].generate_events('form_publish', form, action: vals[:status])

            return { form: form }
          end

          raise GraphQL::ExecutionError, form.errors.full_messages
        end
      end
      # rubocop:enable Metrics/AbcSize

      def update_tasks(form)
        form_user_ids = form.form_users.pluck(:id)
        context[:site_community].notes.where(form_user_id: form_user_ids).update(flagged: false)
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_update_form)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
