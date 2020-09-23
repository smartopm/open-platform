# frozen_string_literal: true

# Contains user's points from event-logs
class ActivityPoint < ApplicationRecord
  belongs_to :user

  def total
    [article, comment, login, referral].sum
  end
end
