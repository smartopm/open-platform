# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label
    class LabelCreate < BaseMutation
      argument :short_desc, String, required: true
      argument :description, String, required: false
      argument :color, String, required: false

      field :label, Types::LabelType, null: true

      def resolve(vals)
        raise_duplicate_label_error(vals[:short_desc])

        label = context[:site_community].labels.create!(vals)
        return { label: label } if label.persisted?

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          admin: true,
          module: :label,
          permission: :can_create_label,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if label already exist with short_desc.
      #
      # @return [GraphQL::ExecutionError]
      def raise_duplicate_label_error(short_desc)
        return unless context[:site_community].label_exists?(short_desc)

        raise GraphQL::ExecutionError, I18n.t('errors.label.duplicate_label')
      end
    end
  end
end
