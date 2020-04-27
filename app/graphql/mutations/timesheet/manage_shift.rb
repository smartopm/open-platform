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
      rescue StandardError => err
        raise GraphQL::ExecutionError, err.full_message #time_sheet.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.custodian?

        true
      end
    end
  end
end
