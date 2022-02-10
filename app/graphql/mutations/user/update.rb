# frozen_string_literal: true

module Mutations
  module User
    # Create a new request/pending member
    # rubocop: disable Metrics/ClassLength
    class Update < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true
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
      argument :country, String, required: false
      argument :company_name, String, required: false
      argument :company_description, String, required: false
      argument :company_linkedin, String, required: false
      argument :company_website, String, required: false
      argument :company_employees, String, required: false
      argument :company_annual_revenue, String, required: false
      argument :company_contacted, String, required: false
      argument :industry, String, required: false
      argument :industry_sub_sector, String, required: false
      argument :industry_business_activity, String, required: false
      argument :level_of_internationalization, String, required: false
      argument :lead_temperature, String, required: false
      argument :lead_status, String, required: false
      argument :lead_source, String, required: false
      argument :lead_owner, String, required: false
      argument :lead_type, String, required: false
      argument :client_category, String, required: false
      argument :next_steps, String, required: false
      argument :created_by, String, required: false
      argument :modified_by, String, required: false
      argument :relevant_link, String, required: false
      argument :first_contact_date, String, required: false
      argument :last_contact_date, String, required: false
      argument :followup_at, String, required: false
      argument :contact_details, GraphQL::Types::JSON, required: false

      field :user, Types::UserType, null: true

      def resolve(vals)
        # raise_duplicate_number_error(vals[:phone_number])

        user = context[:site_community].users.find(vals.delete(:id))
        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found') unless user

        attach_avatars(user, vals)
        log_user_update(user)
        update_secondary_info(user, vals.delete(:secondary_info))

        user_with_substatus_log = update_sub_status_log(user, vals) if vals[:sub_status]
        user_to_update = user_with_substatus_log || user
        update_user(vals, user_to_update)
      end

      def update_user(vals, user_to_update)
        if user_to_update.update(vals.except(*ATTACHMENTS.keys))
          update_substatus_date(user_to_update, vals[:sub_status])
          return { user: user_to_update }
        end
        raise GraphQL::ExecutionError, user_to_update.errors.full_messages&.join(', ')
      end

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

      def update_sub_status_log(user, vals)
        unless context[:current_user].admin?
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        user.sub_status = vals[:sub_status]
        return unless user.sub_status_changed?

        params = sub_status_log_params(user.changes_to_save[:sub_status])
        substatus_log = create_sub_status_log(user, params[:previous_status], params[:new_status])
        user.latest_substatus_id = substatus_log.id
        user
      end

      def sub_status_log_params(changes)
        {
          new_status: changes.last,
          previous_status: changes.first,
        }
      end

      def create_sub_status_log(user, previous_status, new_status)
        Logs::SubstatusLog.create(
          start_date: user.current_time_in_timezone,
          previous_status: previous_status,
          new_status: new_status,
          stop_date: nil,
          user_id: user.id,
          community_id: user.community.id,
          updated_by_id: context[:current_user].id,
        )
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
        unless permissions_checks? || own_user?(vals)
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end
        unless user_record.community_id == current_user.community_id
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        true
      end

      def permissions_checks?
        permitted?(module: :user, permission: :can_update_user_details)
      end
    end
    # rubocop: enable Metrics/ClassLength
  end
end
