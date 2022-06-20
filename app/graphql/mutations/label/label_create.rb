# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label
    class LabelCreate < BaseMutation
      include Helpers::LabelHelper

      argument :short_desc, String, required: true
      argument :description, String, required: false
      argument :color, String, required: false

      field :label, Types::LabelType, null: true

      def resolve(vals)
        short_desc, grouping_name = get_label_details(vals[:short_desc])
        raise_duplicate_label_error(short_desc, grouping_name)
        label = context[:site_community].labels.create!(
          short_desc: short_desc,
          grouping_name: grouping_name,
          color: vals[:color],
        )
        return { label: label } if label.persisted?

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :label, permission: :can_create_label)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if label already exist with short_desc.
      #
      # @return [GraphQL::ExecutionError]
      def raise_duplicate_label_error(short_desc, grouping_name)
        return unless context[:site_community].label_exists?(short_desc, grouping_name)

        raise GraphQL::ExecutionError, I18n.t('errors.label.duplicate_label')
      end
    end
  end
end
