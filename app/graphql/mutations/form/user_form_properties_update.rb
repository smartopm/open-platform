# frozen_string_literal: true

module Mutations
  module Form
    # For updating value of form properties
    class UserFormPropertiesUpdate < BaseMutation
      argument :id, ID, required: true
      argument :value, String, required: true

      field :user_form_property, Types::UserFormPropertiesType, null: true

      def resolve(vals)
        user_form_property = context[:current_user].user_form_properties.find(vals[:id])
        if user_form_property.update(vals.except(:id))
          return { user_form_property: user_form_property } 
        end

        raise GraphQL::ExecutionError, user_form_property.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
