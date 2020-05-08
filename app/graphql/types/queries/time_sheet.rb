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
    com_id = context[:current_user].community_id
    query = ''
    TimeSheet.find_by_sql(["SELECT time_sheets.* FROM time_sheets
        INNER JOIN ( SELECT user_id, max(time_sheets.created_at) as max_date FROM time_sheets
        INNER JOIN users ON users.id = time_sheets.user_id
        WHERE (users.community_id=?) AND (users.name ILIKE ? OR users.phone_number ILIKE ?)
        GROUP BY time_sheets.user_id ORDER BY max_date DESC LIMIT ? OFFSET ?) max_list
        ON time_sheets.created_at = max_list.max_date AND time_sheets.user_id = max_list.user_id
        ORDER BY time_sheets.created_at DESC"] +
        Array.new(1, com_id) + Array.new(2, "%#{query}%") + [limit, offset])
  end

  # The idea was to pass in nth month and query from there till today.
  # If we can find a way of passing the date range here then we would only have data
  # for just one month
  # the date should come in UTC and be zoned from the F.E
  def user_time_sheet_logs(user_id:, offset: 0, limit: 100)
    TimeSheet.where(user_id: user_id, created_at: 1.month.ago..Date.tomorrow)
             .limit(limit).offset(offset)
  end
end

# SELECT * from time_sheets where (From_date BETWEEN '2020-05-07'AND '2020-05-08')
# OR (To_date BETWEEN
# '2020-05-07' AND '2020-05-08') OR (From_date <= '2020-05-07' AND To_date >= '2020-05-08')
# SELECT * FROM time_sheets WHERE created_at >= '2020-05-07' AND created_at <  '2020-05-08'
