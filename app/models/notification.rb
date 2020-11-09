# frozen_string_literal: true

# Model for Notification
class Notification < ApplicationRecord
  belongs_to :notifable, polymorphic: true
end
