# frozen_string_literal: true

module Mutations
  module Form
    # remove a form property from a form
    class FormPropertiesDelete < BaseMutation
      argument :form_id, ID, required: true
      argument :form_property_id, ID, required: true

      field :form_property, Types::FormPropertiesType, null: true
      field :message, GraphQL::Types::String, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise_form_not_found_error(form)

        form_property = form.form_properties.find(vals[:form_property_id])
        form = form_property.form

        if form.has_entries?
          last_version_number = form.last_version
          new_form = form.duplicate(vals[:form_property_id])
          new_form.version_number = (last_version_number + 1)
          new_name = form.name.gsub(/\s\((Version)\s\d*\)/, "")
          new_form.name = "#{new_name} (Version #{last_version_number + 1})"

          if new_form.save
            form.deprecated!
            return { form_property: form_property, message: 'New version created' }
          end
        end

        if form_property.delete
          data = { action: 'removed', field_name: form_property.field_name }
          context[:current_user].generate_events('form_update', form, data)
          return { form_property: form_property, message: '' }
        end

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

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
