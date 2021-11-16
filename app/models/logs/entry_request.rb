# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength
require 'host_env'

module Logs
  # Record of visitor entries to a community
  class EntryRequest < ApplicationRecord
    has_one_attached :video
    has_many_attached :images
    include SearchCop

    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    belongs_to :grantor, class_name: 'Users::User', optional: true
    belongs_to :revoker, class_name: 'Users::User', optional: true
    belongs_to :guest, class_name: 'Users::User', optional: true

    before_validation :attach_community
    validates :name, presence: true
    enum status: { pending: 0, approved: 1 }

    default_scope { order(created_at: :asc) }
    search_scope :search do
      attributes :name, :phone_number, :visitation_date, :visit_end_date, :starts_at, :ends_at,
                 :end_time
    end

    search_scope :search_guest do
      attributes guest: ['guest.phone_number', 'guest.email']
    end

    scope :by_end_time, lambda { |date|
      where('(visit_end_date IS NOT NULL and visit_end_date > ?)
      OR (visit_end_date IS NULL AND (ends_at > ? OR end_time > ?))', date, date, date)
    }

    has_paper_trail

    class Unauthorized < StandardError; end

    GRANT_STATE = %w[Pending Granted Denied].freeze

    ENTRY_REQUEST_STATE = %w[Active Revoked].freeze

    def grant!(grantor)
      update(
        grantor_id: grantor.id,
        granted_state: 1,
        granted_at: Time.zone.now,
        exited_at: nil,
      )
      log_entry_start('granted')
    end

    def deny!(grantor)
      update(
        grantor_id: grantor.id,
        granted_state: 2,
        granted_at: Time.zone.now,
      )
      log_entry_start('denied')
    end

    def revoke!(revoker)
      update!(
        revoker_id: revoker.id,
        entry_request_state: 1,
        revoked_at: Time.zone.now,
      )
      log_guest_entry_revoke('revoked guest entry')
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

    def active?
      self[:entry_request_state].nil? || self[:entry_request_state].zero?
    end

    def revoked?
      self[:entry_request_state] == 1
    end

    # This is deprecated
    def acknowledge!
      update(
        acknowledged: true,
        id: id,
      )
    end

    def send_feedback_link(number)
      feedback_link = "https://#{HostEnv.base_url(user.community)}/feedback"
      Rails.logger.info "Phone number to send #{number}"
      # disabled rubocop to keep the structure of the message
      Sms.send(number, I18n.t('general.thanks_for_using_our_app', feedback_link: feedback_link))
    end

    def access_hours
      invites = Logs::Invite.where(guest_id: guest_id)
      hours = []
      invites.find_each do |invite|
        hours << invite.entry_time
      end
      hours
    end

    private

    # Assigns community id of user.
    #
    # @return [String]
    def attach_community
      self[:community_id] = user&.community_id
    end

    def log_entry_start(action)
      Logs::EventLog.create(
        acting_user: user, community: user.community,
        subject: 'visitor_entry',
        ref_id: self[:id], ref_type: 'Logs::EntryRequest',
        data: {
          action: action,
          ref_name: self[:name],
          type: user.user_type,
        }
      )
    end

    def log_guest_entry_revoke(action)
      Logs::EventLog.create(
        acting_user: user, community: user.community,
        subject: 'revoke_guest_entry',
        ref_id: self[:id], ref_type: 'Logs::EntryRequest',
        data: {
          action: action,
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
  end
  # rubocop:enable Metrics/ClassLength
end
