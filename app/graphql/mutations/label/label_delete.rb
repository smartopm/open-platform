# frozen_string_literal: true

module Mutations
  module Label
    # LabelDelete
    class LabelDelete < BaseMutation
      argument :id, ID, required: true

      field :label_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        label = check_label(id)
        raise_label_not_found_error(label)

        label.user_labels.where(label_id: id).delete_all
        label.campaign_labels.where(label_id: id).delete_all

        return { label_delete: label } if label.update(status: 'deleted')

        raise GraphQL::ExecutionError, label.errors.full_messages&.join(', ')
      end

      def check_label(id)
        context[:site_community].labels.find_by(id: id)
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :label, permission: :can_delete_label)

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
