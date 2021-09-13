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
      argument :user_type, String, required: false
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :expires_at, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false
      argument :sub_status, String, required: false
      argument :secondary_info, [GraphQL::Types::JSON], required: false
      argument :ext_ref_id, String, required: false

      field :user, Types::UserType, null: true
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        user = context[:site_community].users.find(vals.delete(:id))
        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found') unless user

        attach_avatars(user, vals)
        log_user_update(user)
        update_secondary_info(user, vals.delete(:secondary_info))

        if user.update(vals.except(*ATTACHMENTS.keys))
          update_substatus_date(user, vals[:sub_status])
          return { user: user }
        end
        raise GraphQL::ExecutionError, user.errors.full_messages&.join(', ')
      end
      # rubocop:enable Metrics/AbcSize

      def attach_avatars(user, vals)
        ATTACHMENTS.each_pair do |key, attr|
          user.send(attr).attach(vals[key]) if vals[key]
        end
      end

      def update_secondary_info(user, contact_info)
        return if contact_info.nil?

        contact_info.each do |value|
          if value['id'].nil?
            user.contact_infos.create(contact_type: value['contactType'], info: value['info'])
          else
            contact = user.contact_infos.find(value['id'])
            contact.update(info: value['info']) unless contact.info.eql?(value['info'])
          end
        end
      end

      def log_user_update(user)
        Logs::EventLog.create(acting_user_id: context[:current_user].id,
                              community_id: user.community_id, subject: 'user_update',
                              ref_id: user.id,
                              ref_type: user.class.name,
                              data: {
                                ref_name: user.name, note: '', type: user.user_type
                              })
      end

      def own_user?(vals)
        context[:current_user].id == vals[:id]
      end

      def update_substatus_date(user, substatus)
        return if substatus.nil?

        user_logs = user.substatus_logs
        return if user_logs.blank?

        start_date = user.current_time_in_timezone
        user_logs.previous_log(user_logs.first.created_at).update(stop_date: start_date)
      end

      def authorized?(vals)
        check_params(Mutations::User::Create::ALLOWED_PARAMS_FOR_ROLES, vals)
        user_record = Users::User.find(vals[:id])
        current_user = context[:current_user]
        unless current_user.admin? || own_user?(vals)
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end
        unless user_record.community_id == current_user.community_id
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        true
      end
    end
  end
end
