# frozen_string_literal: true

module Logs
  # ActivityLog Record
  class ActivityLog < ApplicationRecord
    belongs_to :community
  end
end
