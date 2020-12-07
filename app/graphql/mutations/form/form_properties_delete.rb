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

        raise GraphQL::ExecutionError, 'Form not found' if form.nil?

        check_form_user(vals[:form_id])
        form_property = form.form_properties.find(vals[:form_property_id])

        data = {action: 'removed',field_name: form_property.field_name}
        if form_property.delete
          context[:current_user].generate_events('form_update', form, data)
          return { form_property: form_property }
        end

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      def check_form_user(form_id)
        form = ::FormUser.find_by(form_id: form_id)
        raise GraphQL::ExecutionError, 'You can not delete from a submitted form' if form.present?
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
