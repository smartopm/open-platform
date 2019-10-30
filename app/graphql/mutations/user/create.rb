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
      argument :phone_number, String, required: false
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false

      field :user, Types::UserType, null: true

      ALLOWED_PARAMS_FOR_ROLES = {
        admin: {}, # Everything
        security_guard: { except: %i[state user_type] },
      }.freeze

      def resolve(vals)
        user = ::User.new(vals.except(*ATTACHMENTS.keys))
        user.community_id = context[:current_user].community_id
        attach_avatars(user, vals)

        return { user: user } if user.save

        raise GraphQL::ExecutionError, user.errors.full_messages
      end

      def attach_avatars(user, vals)
        ATTACHMENTS.each_pair do |key, attr|
          user.send(attr).attach(vals[key]) if vals[key]
        end
      end

      def authorized?(vals)
        check_params(ALLOWED_PARAMS_FOR_ROLES, vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
