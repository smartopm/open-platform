# frozen_string_literal: true

module Mutations
  module Form
    # For updating fields to a form
    class FormPropertiesUpdate < BaseMutation
      argument :form_property_id, ID, required: true
      argument :category_id, ID, required: false
      argument :order, String, required: false
      argument :field_name, String, required: false
      argument :field_type, String, required: false
      argument :field_value, GraphQL::Types::JSON, required: false
      argument :required, Boolean, required: false
      argument :admin_use, Boolean, required: false
      argument :short_desc, String, required: false
      argument :long_desc, String, required: false

      field :form_property, Types::FormPropertiesType, null: true
      field :message, GraphQL::Types::String, null: true
      field :new_form_version, Types::FormType, null: true

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        form_property = Forms::FormProperty.find_by(id: vals[:form_property_id])
        raise_form_property_not_found_error(form_property)

        form = form_property.form
        raise_category_name_related_errors(form, form_property.category, vals[:field_value])

        if form.entries? && destructive_change?(vals, form_property)
          new_form = duplicate_form(form, vals)
          { message: 'New version created', new_form_version: new_form } if new_form.persisted?
        else
          if form_property.update(vals.except(:form_property_id))
            data = { action: 'updated', field_name: vals[:field_name] }
            context[:current_user].generate_events('form_update', form, data)
            return { form_property: form_property }
          end

          raise GraphQL::ExecutionError, form_property.errors.full_messages
        end
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def destructive_change?(vals, form_property)
        vals[:field_name] != form_property.field_name ||
          vals[:field_type] != form_property.field_type ||
          (form_property.field_value.map(&:to_json) - vals[:field_value].map(&:to_json)).present?
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # Raises GraphQL execution error if form property does not exists
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_property_not_found_error(form_property)
        return if form_property

        raise GraphQL::ExecutionError, I18n.t('errors.form_property.not_found')
      end

      # rubocop:disable Style/GuardClause
      # Raises error if the category which is being linked to property does not exists or is same
      # as the parent category
      #
      # @param form [Forms::Form]
      # @param category_name [String]
      # @param field_value [JSON]
      #
      # @return [void]
      def raise_category_name_related_errors(form, category, field_value)
        return if field_value.nil?

        field_value.map do |value|
          if value['category_name'].present?
            if value['category_name'].eql?(category.field_name)
              raise GraphQL::ExecutionError, I18n.t('errors.category.cannot_be_linked')
            elsif !form.categories.exists?(field_name: value['category_name'])
              raise GraphQL::ExecutionError, I18n.t('errors.category.not_found')
            end
          end
        end
      end
      # rubocop:enable Style/GuardClause

      # rubocop:disable Metrics/MethodLength
      # Duplicates form with new version number
      #
      # @param form [Forms::Form]
      # @param vals [Hash]
      #
      # @return new_form [Forms::Form]
      def duplicate_form(form, vals)
        ActiveRecord::Base.transaction do
          last_version_number = form.last_version
          new_form = form.dup
          new_form.version_number = (last_version_number + 1)
          new_name = form.name.gsub(/\s(V)\d*/, '')
          new_form.name = "#{new_name} V#{last_version_number + 1}"

          if new_form.save!
            form.duplicate(new_form, vals, :property_update)
            form.deprecated!
          end
          new_form
        end
      end
      # rubocop:enable Metrics/MethodLength
    end
  end
end
