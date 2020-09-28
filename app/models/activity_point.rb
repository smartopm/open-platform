# frozen_string_literal: true

# Contains user's points from event-logs
class ActivityPoint < ApplicationRecord
  belongs_to :user

  def total
    [article_read, article_shared, comment, login, referral].sum
  end
end
