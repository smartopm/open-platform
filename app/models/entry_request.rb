# frozen_string_literal: true

# Record of visitor entries to a community
class EntryRequest < ApplicationRecord
  belongs_to :user
  belongs_to :community
  belongs_to :grantor, class_name: 'User', optional: true

  before_validation :attach_community
  after_create :notify_admin

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  GRANT_STATE = %w[Pending Granted Denied].freeze

  def grant!(grantor)
    can_grant?(grantor)
    update(
      grantor_id: grantor.id,
      granted_state: 1,
      granted_at: Time.zone.now,
    )
  end

  def deny!(grantor)
    can_grant?(grantor)
    update(
      grantor_id: grantor.id,
      granted_state: 2,
      granted_at: Time.zone.now,
    )
  end

  def granted?
    self[:granted_state] == 1
  end

  def denied?
    self[:granted_state] == 2
  end

  def pending?
    self[:granted_state].nil? || self[:granted_state].zero?
  end

  private

  def can_grant?(grantor)
    raise Unauthorized unless grantor.admin?
  end

  def attach_community
    self[:community_id] = user.community_id
  end

  # TODO: Build this into a proper notification scheme
  def notify_admin
    link = "https://#{ENV['HOST']}/request/#{id}/edit"
    return unless ENV['REQUEST_NOTIFICATION_NUMBER']

    Sms.send(ENV['REQUEST_NOTIFICATION_NUMBER'],
             "New entry request from #{name} - Approve or Deny at #{link}")
  end
end
