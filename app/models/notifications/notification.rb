# frozen_string_literal: true

module Notifications
  # Model for Notification
  class Notification < ApplicationRecord
    belongs_to :notifable, polymorphic: true

    scope :ordered, -> { order(created_at: :desc) }
    scope :ordered_by_seen_at, -> { order(seen_at: :desc) }
    scope :active, -> { where(category: %w[task message]) }

    enum category: { task: 0, comment: 1, reply_requested: 2, message: 3 }
  end
end
