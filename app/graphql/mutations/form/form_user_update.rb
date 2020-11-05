# frozen_string_literal: true

module Mutations
  module Form
    # For updating form users and property values
    class FormUserUpdate < BaseMutation
      argument :user_id, ID, required: true
      argument :form_id, ID, required: true
      argument :prop_values, GraphQL::Types::JSON, required: true

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        form_user = context[:current_user].user_form(vals[:form_id], vals[:user_id])
        return add_user_form_properties(form_user, vals) if form_user.present?

        raise GraphQL::ExecutionError, 'Record not found'
      end

      def add_user_form_properties(form_user, vals)
        JSON.parse(vals[:prop_values])['user_form_properties'].each do |value|
          property = user_form_property(form_user, value.merge(user_id: vals[:user_id]))
          raise GraphQL::ExecutionError, 'User Form Property not found' if property.nil?

          if value.key?('image_blob_id')
            property.attach_file(value)
          else
            property.update!(value.except(:property_id))
          end
        end

        { form_user: form_user }
      end

      def user_form_property(form_user, value)
        form_user.user_form_properties.find_by(form_property_id: value['form_property_id']) ||
          form_user.user_form_properties.create!(value)
      end

      def authorized?(vals)
        return true if context[:current_user]&.admin? ||
                       context[:current_user]&.id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
