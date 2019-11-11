# frozen_string_literal: true

class EntryRequest < ApplicationRecord
  belongs_to :user
  belongs_to :community
  belongs_to :grantor, class_name: 'User', optional: true

  before_validation :attach_community

  class Unauthorized < StandardError; end;

  GRANT_STATE=["Pending", "Granted", "Denied"]

  def grant!(grantor)
    can_grant?(grantor)
    self.update({
      grantor_id: grantor.id,
      granted_state: 1,
      granted_at: Time.now
    })
  end

  def deny!(grantor)
    can_grant?(grantor)
    self.update({
      grantor_id: grantor.id,
      granted_state: 2,
      granted_at: Time.now
    })
  end

  def granted?
    return self[:granted_state] == 1
  end

  def denied?
    return self[:granted_state] == 2
  end

  def pending?
    return self[:granted_state] == 0 || self[:granted_state].nil?
  end

  private

  def can_grant?(grantor)
    raise Unauthorized unless grantor.admin?
  end

  def attach_community
    self[:community_id] = self.user.community_id
  end
end
