# frozen_string_literal: true

module Mutations
  module Form
    # For updating a category
    class CategoryUpdate < BaseMutation
      argument :id, ID, required: true
      argument :field_name, String, required: true
      argument :order, Int, required: true
      argument :header_visible, Boolean, required: true
      argument :general, Boolean, required: true
      argument :description, String, required: false
      argument :rendered_text, String, required: false

      field :category, Types::CategoryType, null: true

      def resolve(values)
        category = Forms::Category.find_by(id: values[:id])
        raise_category_not_found_error(category)

        return { category: category } if category.update(values.except(:id))

        raise GraphQL::ExecutionError, category.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

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
