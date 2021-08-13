# frozen_string_literal: true

module Mutations
  module Form
    # For adding fields to a form
    class FormPropertiesCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :category_id, ID, required: false
      argument :order, String, required: true
      argument :field_name, String, required: true
      argument :field_type, String, required: true
      argument :field_value, GraphQL::Types::JSON, required: false
      argument :required, Boolean, required: false
      argument :admin_use, Boolean, required: false
      argument :short_desc, String, required: false
      argument :long_desc, String, required: false

      field :form_property, Types::FormPropertiesType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise_form_not_found_error(form)

        category = get_category(form, vals[:category_id])
        form_property = category.form_properties.new(vals.merge({ category_id: category.id }))
        data = { action: 'added', field_name: vals[:field_name] }

        if form_property.save
          context[:current_user].generate_events('form_update', form, data)

          return { form_property: form_property }
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

      # Returns category
      #
      # * Raises GraphQL execution error if category id is invalid
      # * Creates category if category_id is not present
      #
      # @param form [Forms::Form]
      # @param category_id [String]
      #
      # @return [Forms::Category]
      def get_category(form, category_id)
        if category_id.present?
          category = form.categories.find_by(id: category_id)
          raise_category_not_found_error(category)
        else
          category = form.categories.create(field_name: 'General Category', general: true,
                                            header_visible: false)
        end
        category
      end

      # Raises GraphQL execution error if category does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_category_not_found_error(category)
        return if category

        raise GraphQL::ExecutionError, I18n.t('errors.category.not_found')
      end
    end
  end
end
