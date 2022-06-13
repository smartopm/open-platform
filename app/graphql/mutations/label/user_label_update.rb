# frozen_string_literal: true

module Mutations
  module Label
    # Unassign a Label from a user
    class UserLabelUpdate < BaseMutation
      argument :user_id, ID, required: true
      argument :label_id, ID, required: true

      field :label, Types::UserLabelType, null: true

      def resolve(user_id:, label_id:)
        label = context[:current_user].find_a_user(user_id).labels.delete(label_id)

        return { success: label } if label

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :label, permission: :can_update_user_label)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
