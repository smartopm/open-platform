# frozen_string_literal: true

module Mutations
  module Form
    # remove a form property from a form
    class FormPropertiesDelete < BaseMutation
      argument :form_id, ID, required: true
      argument :form_property_id, ID, required: true

      field :form_property, Types::FormPropertiesType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise_form_not_found_error(form)

        check_form_user(vals[:form_id])
        form_property = form.form_properties.find(vals[:form_property_id])

        data = { action: 'removed', field_name: form_property.field_name }
        if form_property.delete
          context[:current_user].generate_events('form_update', form, data)
          return { form_property: form_property }
        end

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      def check_form_user(form_id)
        form = Forms::FormUser.find_by(form_id: form_id)
        return if form.blank?

        raise GraphQL::ExecutionError,
              I18n.t('errors.form_user.submitted_form_can_not_be_deleted')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if form does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_not_found_error(form)
        return if form

        raise GraphQL::ExecutionError,
              I18n.t('errors.form.not_found')
      end
    end
  end
end
