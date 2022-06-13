# frozen_string_literal: true

require 'csv'

# Export Event logs as a CSV
class CsvExportController < ApplicationController
  before_action :ensure_admin

  def event_logs
    # Auth with a token
    # Get all event logs for past 30 days
    # format into CSV
    # Send to browser as a file
    # send_data @users.to_csv, filename: "users-#{Date.today}.csv"
    headers = %w[subject description user visitor reason date time user_type]
    csv_string = CSV.generate do |csv|
      csv << headers
      get_event_logs(params).each do |row|
        csv << row
      end
    end
    send_data csv_string, filename: "event_log-#{Time.zone.today}.csv"
  end

  def download_sample_csv
    send_file 'public/bulk_import_sample.csv', filename: 'bulk_import_sample.csv'
  end

  def download_lead_sample_csv
    send_file 'public/lead_import_sample.csv', filename: 'lead_import_sample.csv'
  end

  private

  def get_event_logs(_params)
    # TODO: use params to narrow it down later
    events = Logs::EventLog.where(community_id: @user.community_id,
                                  created_at: 14.days.ago..Float::INFINITY)
    event_logs_to_rows(events, @user.community.timezone)
  end

  def event_logs_to_rows(event_logs, timezone)
    event_logs.map do |ev|
      time = ev.created_at.in_time_zone(timezone || 'UTC')
      data = ev.data || {}
      visitor_details = get_visitor_details(ev)
      [ev.subject, ev.to_sentence, ev.acting_user&.name,
       visitor_details[:name], visitor_details[:reason],
       time.strftime('%Y-%m-%d'), time.strftime('%H:%M:%S'), data['type']]
    end
  end

  def get_visitor_details(event)
    if event.subject == 'visitor_entry'
      entry_request = Logs::EntryRequest.find(event.ref_id)
      { name: entry_request.name, reason: entry_request.reason }
    else
      { name: nil, reason: nil }
    end
  end

  def ensure_admin
    @user = Users::User.find_via_auth_token(params[:token], @site_community)
    raise I18n.t('errors.unauthorized') unless @user && @user&.role?(%i[admin])
  end
end
