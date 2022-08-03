# frozen_string_literal: true

module Mutations
  module Form
    # For updating form users and property values
    class FormUserUpdate < BaseMutation
      argument :user_id, ID, required: true
      argument :form_user_id, ID, required: true
      argument :has_agreed_to_terms, Boolean, required: false
      argument :prop_values, GraphQL::Types::JSON, required: true

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        ActiveRecord::Base.transaction do
          form_user = Forms::FormUser.find_by(id: vals[:form_user_id])
          form_user.pending! if form_user&.draft?
          return add_user_form_properties(form_user, vals) if form_user.present?
        end

        raise GraphQL::ExecutionError, I18n.t('errors.record_not_found')
      end

      def add_user_form_properties(form_user, vals)
        JSON.parse(vals[:prop_values])['user_form_properties'].each do |value|
          property = user_form_property(form_user, value.merge(user_id: vals[:user_id]))
          raise_form_property_not_found_error(property)

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
        return true if permissions_checks? ||
                       context[:current_user]&.id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user form property does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_property_not_found_error(property)
        return if property

        raise GraphQL::ExecutionError, I18n.t('errors.user_form_property.not_found')
      end

      def permissions_checks?
        permitted?(module: :forms, permission: :can_update_form_user)
      end
    end
  end
end
