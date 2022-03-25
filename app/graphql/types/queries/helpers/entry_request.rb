# frozen_string_literal: true

# Helper methods for entry request queries
module Types::Queries::Helpers::EntryRequest
  def duration_based_start_time(duration)
    current_day_start = Time.zone.now.to_datetime.beginning_of_day - timezone_offset

    case duration
    when 'past7Days'
      (current_day_start - 7.days).to_s
    when 'past30Days'
      (current_day_start - 30.days).to_s
    else
      current_day_start.to_s
    end
  end

  def end_time
    (Time.zone.now.to_datetime.end_of_day - timezone_offset).to_s
  end

  # Returns timezone difference in hours
  # * For CM(America/Tegucigalpa) -> -6 hours
  # * For Nkwashi(Africa/Lusaka) -> 2 hours
  #
  # @return ActiveSupport::Duration
  def timezone_offset
    (Time.zone.now.utc_offset / 3600).hours
  end

  def can_view_entry_request?
    permitted?(module: :entry_request, permission: :can_view_entry_request)
  end

  def can_view_entry_requests?
    permitted?(module: :entry_request, permission: :can_view_entry_requests)
  end

  def valid_type?(type)
    %w[peopleEntered peopleExited peoplePresent].include?(type)
  end
end
