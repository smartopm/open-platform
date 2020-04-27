# frozen_string_literal: true

# showroom queries
module Types::Queries::TimeSheet
  extend ActiveSupport::Concern

  included do
    # Get TimeSheet entries
    field :time_sheet_logs, [Types::TimeSheetType], null: true do
      description 'Get all timesheet entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get TimeSheet user entries
    field :user_time_sheet_logs, [Types::TimeSheetType], null: true do
      description 'Get user\'s timesheet logs'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def time_sheet_logs(offset: 0, limit: 100)
    TimeSheet.all.limit(limit).offset(offset)
  end

  def user_time_sheet_logs(user_id:, offset: 0, limit: 100)
    TimeSheet.where(user_id: user_id).limit(limit).offset(offset)
  end
end
