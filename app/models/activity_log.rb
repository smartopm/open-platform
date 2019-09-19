# frozen_string_literal: true

# A list of a members activity
class ActivityLog < ApplicationRecord
  belongs_to :community
  belongs_to :member
  belongs_to :reporting_member, class_name: 'Member'

  before_validation :ensure_community_id
  validate :validate_reporter

  private

  # Bit of early denormalization, but it's very likely
  # we will want to query based on the entry logs of the entire community
  def ensure_community_id
    m = Member.find(self[:member_id])
    self.community_id = m.community_id
  end

  def validate_reporter
    return errors.add(:reporting_member, 'must exist') unless self[:reporting_member_id]

    reporting_member = Member.find(self[:reporting_member_id])
    member = Member.find(self[:member_id])
    return unless reporting_member.community_id != member.community_id

    errors.add(:reporting_member, 'Can only report members in your own community')
  end
end
