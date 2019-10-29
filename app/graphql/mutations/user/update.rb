# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Update < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false

      field :user, Types::UserType, null: true

      def resolve(vals)
        avatar_blob_id = vals.delete(:avatar_blob_id) if vals[:avatar_blob_id]
        document_blob_id = vals.delete(:document_blob_id) if vals[:document_blob_id]
        user = ::User.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless user
        user.avatar.attach(avatar_blob_id) if avatar_blob_id
        user.document.attach(document_blob_id) if document_blob_id

        return { user: user } if user.update(vals)
      end

      def authorized?(vals)
        check_params(Mutations::User::Create::ALLOWED_PARAMS_FOR_ROLES, vals)
        user_record = ::User.find(vals[:id])
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless user_record.community_id ==
                                                             current_user.community_id

        true
      end
    end
  end
end
