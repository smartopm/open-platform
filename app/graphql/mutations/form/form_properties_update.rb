# frozen_string_literal: true

module Mutations
  module Form
    # For updating fields to a form
    class FormPropertiesUpdate < BaseMutation
      argument :id, ID, required: true
      argument :order, String, required: false
      argument :field_name, String, required: false
      argument :field_type, String, required: false
      argument :required, Boolean, required: false
      argument :admin_use, Boolean, required: false
      argument :short_desc, String, required: false
      argument :long_desc, String, required: false

      field :form_property, Types::FormPropertiesType, null: true

      def resolve(vals)
        form_property = ::FormProperty.find(vals[:id])
        return { form_property: form_property } if form_property.update(vals.except(:id))

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
