# frozen_string_literal: true

# showroom queries
module Types::Queries::TimeSheet
    extend ActiveSupport::Concern
  
    included do
      # Get TimeSheet entries
      field :time_sheet_logs, [Types::TimeSheetType], null: true do
        description 'Get all timesheet entries'
      end
    end
  
    def time_sheet_logs(offset: 0, limit: 100)
      TimeSheet.all.limit(limit).offset(offset)
    end
  end
  