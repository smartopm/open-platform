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
      argument :date_from, String, required: false
      argument :date_to, String, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :user_last_shift, Types::TimeSheetType, null: true do
      description 'Get user\'s last timesheet logs'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  # rubocop:disable Metrics/MethodLength
  def time_sheet_logs(offset: 0, limit: 100)
    unless authorized_to_access_timesheets(:can_fetch_time_sheet_logs)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    com_id = context[:current_user].community_id
    query = ''
    Users::TimeSheet.find_by_sql(["SELECT time_sheets.* FROM time_sheets
        INNER JOIN ( SELECT user_id, max(time_sheets.created_at) as max_date FROM time_sheets
        INNER JOIN users ON users.id = time_sheets.user_id
        WHERE (users.community_id=?) AND (users.name ILIKE ? OR users.phone_number ILIKE ?)
        GROUP BY time_sheets.user_id ORDER BY max_date DESC LIMIT ? OFFSET ?) max_list
        ON time_sheets.created_at = max_list.max_date AND time_sheets.user_id = max_list.user_id
        ORDER BY time_sheets.created_at DESC"] +
        Array.new(1, com_id) + Array.new(2, "%#{query}%") + [limit, offset])
  end
  # rubocop:enable Metrics/MethodLength

  # NICK:  Olivier, you need to pass the start date and end date from react in UTC.
  # If none are passed then use the current month.
  #  in this scenario you don t really need a user id.
  # but i think you call this method from the custodian screen.
  # this will need to get reworked a bit to make sure only custodian can retreive .

  # rubocop:disable Metrics/AbcSize
  def user_time_sheet_logs(user_id:, offset: 0, limit: 300, date_to: nil, date_from: nil)
    unless authorized_to_access_timesheets(:can_fetch_user_time_sheet_logs) ||
           context[:current_user]&.id.eql?(user_id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    date_from = date_from.blank? ? Time.current.beginning_of_month : DateTime.parse(date_from)
    user = get_allow_user(user_id)
    return [] if user.nil?

    end_date = DateTime.parse(date_to)
    user.time_sheets.monthly_records(date_from - 1, end_date, limit, offset)
  end
  # rubocop:enable Metrics/AbcSize

  def user_last_shift(user_id:)
    unless authorized_to_access_timesheets(:can_fetch_user_last_shift)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].users.find(user_id).time_sheets.first
  end

  private

  def get_allow_user(user_id)
    return context[:site_community].users.find_by(id: user_id) if admin_or_custodian

    context[:current_user]
  end

  def admin_or_custodian
    context[:current_user].admin? || context[:current_user].custodian?
  end

  def authorized_to_access_timesheets(permission)
    permitted?(module: :timesheet, permission: permission)
  end
end
