# frozen_string_literal: true

module Mutations
  module Form
    # For adding fields to a form
    class FormPropertiesCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :order, String, required: true
      argument :field_name, String, required: true
      argument :field_type, String, required: true
      argument :field_value, GraphQL::Types::JSON, required: false
      argument :required, Boolean, required: false
      argument :admin_use, Boolean, required: false
      argument :short_desc, String, required: false
      argument :long_desc, String, required: false

      field :form_property, Types::FormPropertiesType, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise GraphQL::ExecutionError, 'Form not found' if form.nil?

        form_property = form.form_properties.new(vals)
        data = {
          action: 'added',
          field_name: vals[:field_name]
        }

        context[:current_user].generate_events('form_update', form, data)

        return { form_property: form_property } if form_property.save

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
