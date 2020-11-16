# frozen_string_literal: true

module Mutations
    module Form
      # remove a form property from a form
      class FormPropertiesDelete < BaseMutation
        argument :form_id, ID, required: true
        argument :form_property_id, ID, required: true
  
        field :form_property, Types::FormPropertiesType, null: true
  
        def resolve(vals)
          form = context[:site_community].forms.find(vals[:form_id])
          raise GraphQL::ExecutionError, 'Form not found' if form.nil?
  
          form_property = form.form_properties.find(vals[:form_property_id])
          return { form_property: form_property } if form_property.delete
  
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
  