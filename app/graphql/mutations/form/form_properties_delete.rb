# frozen_string_literal: true

module Mutations
  module Form
    # remove a form property from a form
    class FormPropertiesDelete < BaseMutation
      argument :form_id, ID, required: true
      argument :form_property_id, ID, required: true

      field :form_property, Types::FormPropertiesType, null: true
      field :message, GraphQL::Types::String, null: true
      field :new_form_version, Types::FormType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise_form_not_found_error(form)

        form_property = form.form_properties.find(vals[:form_property_id])
        raise_form_property_not_found_error(form_property)

        args = { grouping_id: form_property.grouping_id, field_value: form_property.field_value }

        if form.entries?
          new_form = duplicate_form(form, vals)
          update_category_display_condition(args.merge(form: new_form))
          { message: 'New version created', new_form_version: new_form } if new_form.persisted?
        else
          if form_property.destroy
            update_category_display_condition(args.merge(form: form))
            data = { action: 'removed', field_name: form_property.field_name }
            context[:current_user].generate_events('form_update', form, data)
            return { form_property: form_property }
          end

          raise GraphQL::ExecutionError, form_property.errors.full_messages
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_delete_form_properties)

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

      # Raises GraphQL execution error if form property does not exists
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_property_not_found_error(form_property)
        return if form_property

        raise GraphQL::ExecutionError, I18n.t('errors.form_property.not_found')
      end

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
            form.duplicate(new_form, vals, :property_delete)
            form.deprecated!
          end
          new_form
        end
      end
      # rubocop:enable Metrics/MethodLength

      # Resets the grouping_id in display condition for categories which have grouping_id same as
      # the form property which is being deleted
      #
      # @param args [Hash]
      #
      # @return [void]
      def update_category_display_condition(args = {})
        return if args[:field_value].nil?

        categories = args[:form].categories.where("display_condition->>'grouping_id' = ?",
                                                  args[:grouping_id])
        categories.each do |category|
          category.display_condition['grouping_id'] = ''
          category.save!
        end
      end
    end
  end
end
