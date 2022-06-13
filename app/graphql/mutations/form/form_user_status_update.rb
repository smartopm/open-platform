# frozen_string_literal: true

module Mutations
  module Form
    # For updating status of form users
    class FormUserStatusUpdate < BaseMutation
      argument :form_user_id, ID, required: true
      argument :status, String, required: true

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        user = context[:current_user]
        form_user = Forms::FormUser.find_by(id: vals[:form_user_id])
        raise_form_user_not_found_error(form_user)

        return { form_user: form_user } if form_user.update(status: vals[:status],
                                                            status_updated_by: user)

        raise GraphQL::ExecutionError, form_user.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :forms, permission: :can_update_form_user_status)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if form user does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_user_not_found_error(form_user)
        return if form_user

        raise GraphQL::ExecutionError, I18n.t('errors.record_not_found')
      end
    end
  end
end
