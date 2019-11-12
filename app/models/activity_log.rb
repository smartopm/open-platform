# frozen_string_literal: true

# A list of a users activity
class ActivityLog < ApplicationRecord
  belongs_to :community
  belongs_to :user
  belongs_to :reporting_user, class_name: 'User'

  before_validation :ensure_community_id
  after_create :update_user
  validate :validate_reporter

  default_scope { order(created_at: :asc) }

  private

  # Bit of early denormalization, but it's very likely
  # we will want to query based on the entry logs of the entire community
  def ensure_community_id
    u = User.find(self[:user_id])
    self.community_id = u.community_id
  end

  def validate_reporter
    return errors.add(:reporting_user, 'must exist') unless self[:reporting_user_id]

    reporting_user = User.find(self[:reporting_user_id])
    user = User.find(self[:user_id])
    return if reporting_user.community_id == user.community_id

    errors.add(:reporting_user, 'Can only report users in your own community')
  end

  def update_user
    user.update(last_activity_at: Time.zone.now)
  end
end
