# frozen_string_literal: true

module Mutations
  module Form
    # For updating fields to a form
    class FormPropertiesUpdate < BaseMutation
      argument :id, ID, required: true
      argument :order, String, required: false
      argument :field_name, String, required: false
      argument :field_type, String, required: false
      argument :field_value, GraphQL::Types::JSON, required: false
      argument :required, Boolean, required: false
      argument :admin_use, Boolean, required: false
      argument :short_desc, String, required: false
      argument :long_desc, String, required: false

      field :form_property, Types::FormPropertiesType, null: true

      def resolve(vals)
        form_property = Forms::FormProperty.find(vals[:id])
        form = form_property.form

        if form.has_entries?
          if has_destructive_change?(vals, form_property)
            latest_form_version = form.latest_version
            new_version_number = (latest_form_version.nil? ? 2 : latest_form_version + 1)
            new_form = form.duplicate(vals[:id])
            new_form.form_properties <<  new_form.form_properties.new(vals.except(:id))
            new_form.version_number = new_version_number
            new_name = form.name.gsub(/\s\((Version)\s\d*\)/, "")
            new_form.name = "#{new_name} (Version #{new_version_number})"

            if new_form.save!
              form_property.form.update(version_number: 1) if latest_form_version.nil?
              return { form_property: form_property }
            end
          end
        end

        if form_property.update(vals.except(:id))
          data = { action: 'updated', field_name: vals[:field_name] }
          context[:current_user].generate_events('form_update', form, data)
          return { form_property: form_property }
        end

        raise GraphQL::ExecutionError, form_property.errors.full_messages
      end

      def has_destructive_change?(vals, form_property)
        vals[:field_name] != form_property.field_name ||
        vals[:field_type] != form_property.field_type ||
        (form_property.field_value - vals[:field_value]).present?
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
