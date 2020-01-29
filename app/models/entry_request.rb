# frozen_string_literal: true

# Record of visitor entries to a community
class EntryRequest < ApplicationRecord
  belongs_to :user
  belongs_to :community
  belongs_to :grantor, class_name: 'User', optional: true

  before_validation :attach_community
  after_create :log_entry
  after_create :notify_admin, unless: :showroom?

  validates :name, presence: true

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  GRANT_STATE = %w[Pending Granted Denied].freeze

  def grant!(grantor)
    update(
      grantor_id: grantor.id,
      granted_state: 1,
      granted_at: Time.zone.now,
    )
    log_decision(true)
  end

  def deny!(grantor)
    update(
      grantor_id: grantor.id,
      granted_state: 2,
      granted_at: Time.zone.now,
    )
    log_decision(false)
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

  def showroom?
    self[:source] == 'showroom'
  end

  private

  def attach_community
    self[:community_id] = user.community_id
  end

  def log_entry
    if showroom?
      log_showroom_entry
    else
      log_entry_start
    end
  end

  def log_entry_start
    EventLog.create(
      acting_user: user, community: user.community,
      subject: 'visitor_entry',
      ref_id: self[:id], ref_type: 'EntryRequest',
      data: {
        action: 'started',
        ref_name: self[:name],
      }
    )
  end

  def log_showroom_entry
    EventLog.create(
      acting_user: user, community: user.community,
      subject: 'kiosk_registration',
      ref_id: self[:id], ref_type: 'EntryRequest',
      data: {
        action: 'created',
        ref_name: self[:name],
      }
    )
  end

  def log_decision(approved)
    EventLog.create(
      acting_user: grantor, community: user.community,
      subject: 'visitor_entry',
      ref_id: self[:id], ref_type: 'EntryRequest',
      data: {
        action: approved ? 'granted' : 'denied',
        ref_name: self[:name],
      }
    )
  end

  def acknowledge!
    update(
      acknowledged: true,
    )
    log_decision(true)
  end

  # TODO: Build this into a proper notification scheme
  def notify_admin
    link = "https://#{ENV['HOST']}/request_hos/#{id}/edit"
    Rails.logger.info "Sending entry request approval notification for #{link}"
    return unless ENV['REQUEST_NOTIFICATION_NUMBER']

    Sms.send(ENV['REQUEST_NOTIFICATION_NUMBER'],
             "FYI #{name} - has been granted/denied entry by #{user.name},
             for details click #{link}")
  end
end
