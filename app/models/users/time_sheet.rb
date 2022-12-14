# frozen_string_literal: true

module Users
  # TimeSheet model
  class TimeSheet < ApplicationRecord
    belongs_to :user
    belongs_to :community
    belongs_to :shift_start_event_log, optional: true, class_name: 'Logs::EventLog'
    belongs_to :shift_end_event_log, optional: true, class_name: 'Logs::EventLog'
    default_scope { order(created_at: :desc) }
    scope :monthly_records, lambda { |date_from, date_to, limit, offset|
      where(TimeSheet.arel_table[:created_at].gteq(date_from))
        .where(TimeSheet.arel_table[:created_at].lt(date_to)).limit(limit).offset(offset)
    }
  end
end
