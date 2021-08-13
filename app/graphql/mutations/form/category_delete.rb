# frozen_string_literal: true

module Mutations
  module Form
    # For deleting a category
    class CategoryDelete < BaseMutation
      argument :form_id, ID, required: true
      argument :category_id, ID, required: true

      field :message, String, null: true

      def resolve(values)
        form = Forms::Form.find_by(id: values[:form_id])
        raise_form_not_found_error(form)

        category = form.categories.find_by(id: values[:category_id])
        raise_category_not_found_error(category)

        return { message: 'Category deleted successfully' } if category.destroy

        raise GraphQL::ExecutionError, category.errors.full_messages
      end

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
