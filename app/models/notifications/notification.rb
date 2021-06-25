# frozen_string_literal: true

module Notifications
  # Model for Notification
  class Notification < ApplicationRecord
    belongs_to :notifable, polymorphic: true
  end
end
