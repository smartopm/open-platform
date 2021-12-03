# frozen_string_literal: true

module Mutations
  module Form
    # For adding values to form properties
    class UserFormPropertiesCreate < BaseMutation
      argument :form_property_id, ID, required: true
      argument :form_user_id, ID, required: true
      argument :value, String, required: true

      field :user_form_property, Types::UserFormPropertiesType, null: true

      def resolve(vals)
        user_form_property = context[:current_user].user_form_properties.new(vals)
        return { user_form_property: user_form_property } if user_form_property.save

        raise GraphQL::ExecutionError, user_form_property.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_create_user_form_properties)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
