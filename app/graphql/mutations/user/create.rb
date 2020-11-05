# frozen_string_literal: true

module Mutations
  module User
    ATTACHMENTS = {
      avatar_blob_id: :avatar,
      document_blob_id: :document,
    }.freeze

    # Create a new request/pending member
    class Create < BaseMutation
      argument :name, String, required: true
      argument :email, String, required: false
      argument :phone_number, String, required: true
      argument :user_type, String, required: true
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false
      argument :sub_status, String, required: false

      field :user, Types::UserType, null: true

      ALLOWED_PARAMS_FOR_ROLES = {
        admin: {}, # Everything
        security_guard: { except: %i[state user_type] },
      }.freeze

      def resolve(vals)
        user = nil
        raise GraphQL::ExecutionError, 'Duplicate phone' if number_exists?(vals[:phone_number])

        begin
          user = context[:current_user].enroll_user(vals)
          return { user: user } if user.present? && user.errors.blank?
        rescue ActiveRecord::RecordNotUnique
          raise GraphQL::ExecutionError, 'Duplicate email'
        end

        raise GraphQL::ExecutionError, user.errors.full_messages
      end

      def number_exists?(phone_number)
        user = context[:current_user].find_via_phone_number(phone_number)
        return false if user.nil?

        true
      end

      def authorized?(_vals)
        # allowing all users to create clients
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
