# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    class Update < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :address, String, required: false
      argument :user_type, String, required: true
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :expires_at, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false
      argument :sub_status, String, required: false
      argument :secondary_info, GraphQL::Types::JSON, required: false

      field :user, Types::UserType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless user

        attach_avatars(user, vals)
        log_user_update(user)
        update_secondary_info(user, vals.delete(:secondary_info))
        return { user: user } if user.update(vals.except(*ATTACHMENTS.keys))

        raise GraphQL::ExecutionError, user.errors.full_messages
      end

      def attach_avatars(user, vals)
        ATTACHMENTS.each_pair do |key, attr|
          user.send(attr).attach(vals[key]) if vals[key]
        end
      end

      def update_secondary_info(user, contact_info)
        JSON.parse(contact_info).each do |_key, value|
          user.contact_infos.find(value.first)&.update(info: value.last)
        end
      end

      def log_user_update(user)
        ::EventLog.create(acting_user_id: context[:current_user].id,
                          community_id: user.community_id, subject: 'user_update',
                          ref_id: user.id,
                          ref_type: 'User',
                          data: {
                            ref_name: user.name, note: '', type: user.user_type
                          })
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
