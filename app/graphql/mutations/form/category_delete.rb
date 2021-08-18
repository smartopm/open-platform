# frozen_string_literal: true

module Mutations
  module Form
    # For deleting a category
    class CategoryDelete < BaseMutation
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
        category_name = category.field_name

        if form.entries?
          new_form = duplicate_form(form, values)
          remove_category_name_from_field_value(new_form, category_name)
          { message: 'New version created', new_form_version: new_form } if new_form.persisted?
        else
          if category.destroy
            remove_category_name_from_field_value(form, category_name)
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

      # rubocop:disable Metrics/MethodLength
      # Duplicates form with new version number
      #
      # @param form [Forms::Form]
      # @param values [Hash]
      #
      # @return new_form [Forms::Form]
      def duplicate_form(form, values)
        ActiveRecord::Base.transaction do
          last_version_number = form.last_version
          new_form = form.dup
          new_form.version_number = (last_version_number + 1)
          new_name = form.name.gsub(/\s(V)\d*/, '')
          new_form.name = "#{new_name} V#{last_version_number + 1}"

          if new_form.save!
            form.duplicate(new_form, values, :category_delete)
            form.deprecated!
            new_form
          end
        end
      end
      # rubocop:enable Metrics/MethodLength

      # Removes the category_name of field value where the category_name is same as the field
      # name of category which is going to be deleted
      #
      # @param form [Forms::Form]
      # @param category_name [String]
      #
      # @return [void]
      def remove_category_name_from_field_value(form, category_name)
        form_properties = form.form_properties.where('field_value::jsonb @> ?',
                                                     [{ category_name: category_name }].to_json)
        form_properties.each do |property|
          property.field_value&.map do |values|
            values['category_name'] = '' if values['category_name'].eql?(category_name)
          end
          property.save!
        end
      end
    end
  end
end
