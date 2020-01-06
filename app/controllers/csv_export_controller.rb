# frozen_string_literal: true

# Export Event logs as a CSV
class CsvExportController < ApplicationController
  before_action :ensure_admin

  def event_logs
    # Auth with a token
    # Get all event logs for past 30 days
    # format into CSV
    # Send to browser as a file
    # send_data @users.to_csv, filename: "users-#{Date.today}.csv"
    headers = %w[subject description user timestamp]
    csv_string = CSV.generate do |csv|
      csv << headers
      get_event_logs(params).each do |ev|
        csv << [ev.subject, ev.to_sentence, ev.acting_user.name, ev.created_at]
      end
    end
    send_data csv_string, filename: "event_log-#{Time.zone.today}.csv"
  end

  private

  def get_event_logs(_params)
    # TODO: use params to narrow it down later
    EventLog.where(community_id: @user.community_id,
                   created_at: 30.days.ago..Float::INFINITY).each
  end

  def ensure_admin
    @user = User.find_via_auth_token(params[:token])
    raise 'Unauthorized' unless @user && @user&.role?(%i[admin])
  end
end
