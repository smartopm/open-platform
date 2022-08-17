# frozen_string_literal: true

module Mutations
  module User
    # Reset user password
    class ResetPassword < BaseMutation
      argument :email, String, required: true

      field :success, GraphQL::Types::Boolean, null: true

      def resolve(vals)
        user = return_user_or_error(vals[:email])
        password = SecureRandom.alphanumeric

        unless user.update(username: user.autogenerate_username, password: password,
                           has_reset_password: false)
          raise GraphQL::ExecutionError, user.errors.full_messages&.join(', ')
        end

        eventlog = user.generate_events('password_reset', user)
        ActionFlowJob.perform_later(eventlog, { password: password })
        { success: true }
      end

      def return_user_or_error(email)
        user = context[:site_community].users.find_by(email: email)
        if user.nil?
          raise GraphQL::ExecutionError,
                I18n.t('errors.user.not_found_with_email', email: email)
        end
        user
      end
    end
  end
end
