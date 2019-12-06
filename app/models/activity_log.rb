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

  # For converting over to EventLog management
  def update_or_create_event_log
    return unless user && reporting_user
    return update_matching_event_log(id) if EventLog.find_by(id: id)

    create_matching_event_log
  end

  def create_matching_event_log
    EventLog.create(
      id: id,
      acting_user_id: reporting_user.id, community_id: community_id,
      subject: 'user_entry', ref_id: user.id, ref_type: 'User',
      created_at: created_at,
      data: {
        ref_name: user.name, note: note
      }
    )
  end

  def update_matching_event_log(id)
    EventLog.find(id).update(
      acting_user_id: reporting_user.id, community_id: community_id,
      subject: 'user_entry', ref_id: user.id, ref_type: 'User',
      created_at: created_at,
      data: {
        ref_name: user.name, note: note
      }
    )
  end

  private

  # Bit of early denormalization, but it's very likely
  # we will want to query based on the entry logs of the entire community
  def ensure_community_id
    return if community_id

    if !community_id && !user
      errors.add(:community_id, 'Must belong to a community')
      return
    end

    u = User.find(self[:user_id])
    self.community_id = u.community_id
  end

  def validate_reporter
    return unless reporting_user

    reporting_user = User.find(self[:reporting_user_id])
    user = User.find(self[:user_id])
    return if reporting_user.community_id == user.community_id

    errors.add(:reporting_user, 'Can only report users in your own community')
  end

  def update_user
    return unless user

    user.update(last_activity_at: Time.zone.now)
  end
end
