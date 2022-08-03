# frozen_string_literal: true

module Mutations
  module Form
    # For updating a category
    class CategoryUpdate < BaseMutation
      include Helpers::FormHelper

      argument :category_id, ID, required: true
      argument :field_name, String, required: true
      argument :order, Int, required: true
      argument :header_visible, Boolean, required: true
      argument :general, Boolean, required: true
      argument :description, String, required: false
      argument :rendered_text, String, required: false
      argument :display_condition, GraphQL::Types::JSON, required: false

      field :category, Types::CategoryType, null: true
      field :message, String, null: true
      field :new_form_version, Types::FormType, null: true

      # rubocop:disable Metrics/MethodLength
      def resolve(values)
        category = Forms::Category.find_by(id: values[:category_id])
        raise_category_not_found_error(category)

        form = category.form
        if form.entries?
          new_form = duplicate_form(form, values, :category_update)
          { message: 'New version created', new_form_version: new_form } if new_form.persisted?
        else
          if category.update(values.except(:category_id))
            data = { action: 'updated', field_name: values[:field_name] }
            context[:current_user].generate_events('form_update', form, data)
            return { category: category }
          end

          raise GraphQL::ExecutionError, category.errors.full_messages
        end
      end
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_update_category)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

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
