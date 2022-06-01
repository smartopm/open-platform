# frozen_string_literal: true

module Notifications
  # Model for Notification
  class Notification < ApplicationRecord
    belongs_to :notifable, polymorphic: true

    enum category: { task: 0, comment: 1, reply_requested: 2, message: 3 }
  end
end
