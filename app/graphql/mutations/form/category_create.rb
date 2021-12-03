# frozen_string_literal: true

module Mutations
  module Form
    # For creating a category
    class CategoryCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :field_name, String, required: true
      argument :order, Int, required: true
      argument :header_visible, Boolean, required: true
      argument :general, Boolean, required: true
      argument :description, String, required: false
      argument :rendered_text, String, required: false
      argument :display_condition, GraphQL::Types::JSON, required: false

      field :category, Types::CategoryType, null: true

      def resolve(values)
        form = context[:site_community].forms.find_by(id: values[:form_id])
        raise_form_not_found_error(form)

        category = form.categories.create(values)
        return { category: category } if category.persisted?

        raise GraphQL::ExecutionError, category.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_create_category)

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
    end
  end
end
