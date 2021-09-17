# frozen_string_literal: true

module Mutations
  module SubstatusLog
    # Update a SubstatusLog
    class SubstatusLogUpdate < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true
      argument :start_date, String, required: true

      field :log, Types::SubstatusLogType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        user = context[:site_community].users.find_by(id: vals[:user_id])
        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found') if user.nil?

        user_log = user.substatus_logs.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.substatus_log.not_found') if user_log.nil?

        vals[:updated_by_id] = context[:current_user].id
        if user_log.update(vals)
          update_previous(user_log, user, vals[:start_date])
          return { log: user_log }
        end
        raise GraphQL::ExecutionError, user_log.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      # stopdate will be the startdate for the recent log, if there is no prevlog then we move on
      def update_previous(log, user, start_date)
        prev_log = user.substatus_logs.previous_log(log.created_at)
        return if prev_log.blank?

        sd = start_date < prev_log.first.start_date
        raise GraphQL::ExecutionError, I18n.t('errors.substatus_log.date_must_be_greater') if sd

        prev_log.update(stop_date: start_date)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
