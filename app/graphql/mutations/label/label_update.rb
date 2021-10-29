# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label
    class LabelUpdate < BaseMutation
      argument :id, ID, required: true
      argument :short_desc, String, required: true
      argument :description, String, required: false
      argument :color, String, required: true

      field :label, Types::LabelType, null: true

      def resolve(vals)
        label = context[:site_community].labels.find_by(id: vals[:id])
        raise_label_not_found_error(label)

        return { label: label } if label.update(vals)

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          admin: true,
          module: :label,
          permission: :can_update_label,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if label does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_label_not_found_error(label)
        return if label

        raise GraphQL::ExecutionError, I18n.t('errors.label.not_found')
      end
    end
  end
end
