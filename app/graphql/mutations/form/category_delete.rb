# frozen_string_literal: true

module Mutations
  module Form
    # For deleting a category
    class CategoryDelete < BaseMutation
      include Helpers::FormHelper

      argument :form_id, ID, required: true
      argument :category_id, ID, required: true

      field :message, String, null: true
      field :new_form_version, Types::FormType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(values)
        form = Forms::Form.find_by(id: values[:form_id])
        raise_form_not_found_error(form)

        category = form.categories.find_by(id: values[:category_id])
        raise_category_not_found_error(category)

        if form.entries?
          new_form = duplicate_form(form, values, :category_delete)
          { message: 'New version created', new_form_version: new_form } if new_form.persisted?
        else
          if category.destroy
            data = { action: 'removed', field_name: category.field_name }
            context[:current_user].generate_events('form_update', form, data)
            return { message: I18n.t('response.category_deleted') }
          end

          raise GraphQL::ExecutionError, category.errors.full_messages
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_delete_category)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if form does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_not_found_error(form)
        return if form

        raise GraphQL::ExecutionError, I18n.t('errors.form.not_found')
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
