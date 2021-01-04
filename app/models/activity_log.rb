# frozen_string_literal: true

# ActivityLog Record
class ActivityLog < ApplicationRecord
  belongs_to :community
end
