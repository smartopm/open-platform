# frozen_string_literal: true

require 'host_env'

module Logs
  # rubocop:disable Metrics/ClassLength
  # Record of visitor entries to a community
  class EntryRequest < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    belongs_to :grantor, class_name: 'Users::User', optional: true

    before_validation :attach_community
    after_create :log_entry
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
      log_decision('granted', last_event_log.id)
    end

    def deny!(grantor)
      update(
        grantor_id: grantor.id,
        granted_state: 2,
        granted_at: Time.zone.now,
      )
      log_decision('denied', last_event_log.id)
    end

    # Leaving this here for now in case it is needed
    def create_entry_task
      task_obj = {
        body: "New prospective client
        <a href=\"https://#{HostEnv.base_url(user.community)}/request/#{self[:id]}/logs\">
        #{self[:name]}</a>
        visited Nkwashi site. Please enroll them in system and setup a follow-up call",
        category: 'to_do',
        flagged: true,
        completed: false,
        due_date: 5.days.from_now,
      }
      assign_task(user.generate_note(task_obj).id)
    end

    def assign_task(note_id)
      user.community.notes.find(note_id)
          .assign_or_unassign_user(user.community.default_community_users[0].id)
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
      log_decision('acknowledged', last_event_log.id)
    end

    # TODO: Build this into a proper notification scheme
    def notify_admin(granted)
      return unless ENV['REQUEST_NOTIFICATION_NUMBER']

      link = "https://#{HostEnv.base_url(user.community)}/request_hos/#{id}/edit"
      Rails.logger.info "Sending entry request approval notification for #{link}"

      Sms.send(ENV['REQUEST_NOTIFICATION_NUMBER'],
               "FYI #{name} -
        has been #{granted ? 'granted' : 'denied'} entry by #{user.name},
        for details click #{link}")
    end

    def send_feedback_link(number)
      feedback_link = "https://#{HostEnv.base_url(user.community)}/feedback"
      Rails.logger.info "Phone number to send #{number}"
      # disabled rubocop to keep the structure of the message
      # rubocop:disable Layout/LineLength
      Sms.send(number, "Thank you for using our app, kindly use this link to give us feedback #{feedback_link}")
      # rubocop:enable Layout/LineLength
    end

    def notify_client(number)
      SMS.send(number, "https://#{HostEnv.base_url(user.community)}/feedback")
    end

    def last_event_log
      Logs::EventLog.where('ref_id=? and ref_type=?', id, self.class).last
    end

    private

    # Assigns community id of user.
    #
    # @return [String]
    def attach_community
      self[:community_id] = user&.community_id
    end

    def log_entry
      if showroom?
        log_showroom_entry
      else
        log_entry_start

      end
    end

    def log_entry_start
      Logs::EventLog.create(
        acting_user: user, community: user.community,
        subject: self[:visitation_date].nil? ? 'visitor_entry' : 'visit_request',
        ref_id: self[:id], ref_type: 'Logs::EntryRequest',
        data: {
          action: self[:visitation_date].nil? ? 'started' : 'requested',
          ref_name: self[:name],
          type: user.user_type,
        }
      )
    end

    def log_showroom_entry
      Logs::EventLog.create(
        acting_user: user, community: user.community,
        subject: 'showroom_entry',
        ref_id: self[:id], ref_type: 'Logs::EntryRequest',
        data: {
          action: 'created',
          ref_name: self[:name],
          type: 'showroom',
        }
      )
    end

    def log_decision(decision, event_id)
      event = Logs::EventLog.find(event_id)
      return false if event.blank?

      event.data['action'] = decision
      event.save
    end
  end
  # rubocop:enable Metrics/ClassLength
end
