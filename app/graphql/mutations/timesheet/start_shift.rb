# frozen_string_literal: true

module Mutations
  module Timesheet
    # Create timesheet record
    class StartShift < BaseMutation
      argument :user_id, ID, required: true

      field :time_sheet, Types::TimeSheetType, null: true

      def resolve(user_id:)
        begin
          time_sheet = context[:current_user].manage_shift(user_id, 'shift_start')
          return { time_sheet: time_sheet } if time_sheet.present?
        rescue StandardError
          raise GraphQL::ExecutionError, time_sheet.errors.full_messages
        end
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.custodian?

        true
      end
    end
  end
end
