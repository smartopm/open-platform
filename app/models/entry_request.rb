# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength
# Record of visitor entries to a community
class EntryRequest < ApplicationRecord
  belongs_to :user
  belongs_to :community
  belongs_to :grantor, class_name: 'User', optional: true

  before_validation :attach_community
  after_create :log_entry
  validates :name, presence: true

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  GRANT_STATE = %w[Pending Granted Denied].freeze

  def grant!(grantor, event_id)
    update(
      grantor_id: grantor.id,
      granted_state: 1,
      granted_at: Time.zone.now,
    )
    log_decision('granted', event_id)
  end

  def deny!(grantor, event_id)
    update(
      grantor_id: grantor.id,
      granted_state: 2,
      granted_at: Time.zone.now,
    )
    log_decision('denied', event_id)
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

  def acknowledge!
    update(
      acknowledged: true,
      id: id,
    )
    log_decision('acknowledged')
  end

  # TODO: Build this into a proper notification scheme
  def notify_admin(granted)
    return unless ENV['REQUEST_NOTIFICATION_NUMBER']

    link = "https://#{ENV['HOST']}/request_hos/#{id}/edit"
    Rails.logger.info "Sending entry request approval notification for #{link}"

    Sms.send(ENV['REQUEST_NOTIFICATION_NUMBER'],
             "FYI #{name} -
      has been #{granted ? 'granted' : 'denied'} entry by #{user.name},
      for details click #{link}")
  end

  def send_feedback_link(number)
    feedback_link = "https://#{ENV['HOST']}/feedback"
    Rails.logger.info "Phone number to send #{number}"
    # disabled rubocop to keep the structure of the message
    # rubocop:disable LineLength
    Sms.send(number, "Thank you for using our app, kindly use this link to give us feedback #{feedback_link}")
    # rubocop:enable LineLength
  end

  def notify_client(number)
    SMS.send(number, "https://#{ENV['HOST']}/feedback")
  end

  def last_event_log
    EventLog.where('ref_id=? and ref_type=?', id, self.class).last
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
        type: user.user_type,
      }
    )
  end

  def log_showroom_entry
    EventLog.create(
      acting_user: user, community: user.community,
      subject: 'showroom_entry',
      ref_id: self[:id], ref_type: 'EntryRequest',
      data: {
        action: 'created',
        ref_name: self[:name],
        type: 'showroom',
      }
    )
  end

  def log_decision(decision, event_id)
    event = EventLog.find(event_id)
    return false if event.blank?

    event.data['action'] = decision
    event.save
  end
end

# rubocop:enable Metrics/ClassLength
