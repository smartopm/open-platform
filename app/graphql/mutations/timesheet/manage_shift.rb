# frozen_string_literal: true

module Mutations
  module Timesheet
    # Create timesheet record
    class ManageShift < BaseMutation
      argument :user_id, ID, required: true
      argument :event_tag, String, required: true

      field :time_sheet, Types::TimeSheetType, null: true

      def resolve(user_id:, event_tag:)
        time_sheet = context[:current_user].manage_shift(user_id, event_tag)
        return { time_sheet: time_sheet } if time_sheet.present?
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found_with_id', user_id: user_id)
      rescue StandardError => e
        Rails.logger.warn e.full_message
        raise GraphQL::ExecutionError, I18n.t('errors.can_not_process_request')
      end

      def authorized?(_vals)
        return true if permitted?(module: :timesheet, permission: :can_manage_shift)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
