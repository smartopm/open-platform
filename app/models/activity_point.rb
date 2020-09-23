class ActivityPoint < ApplicationRecord
  belongs_to :user

  def total
    [article, comment, login, referral].sum
  end
end
