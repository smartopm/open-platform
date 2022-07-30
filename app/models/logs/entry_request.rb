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
    has_many :invites, dependent: :destroy
    has_many :entry_times, through: :invites

    before_validation :attach_community
    validates :name, presence: true
    enum status: { pending: 0, approved: 1 }

    # rubocop:disable Style/RedundantInterpolation
    search_scope :search do
      attributes :name, :phone_number, :visitation_date, :visit_end_date, :starts_at, :ends_at,
                 :end_time

      generator :matches do |column_name, raw_value|
        pattern = "%#{raw_value}%"
        QueryFetchable.accent_insensitive_search(column_name, "#{quote pattern}")
      end
    end

    search_scope :search_guest do
      attributes guest: ['guest.phone_number', 'guest.email']
    end
    # rubocop:enable Style/RedundantInterpolation

    scope :order_by_recent_invites, lambda {
      includes(:entry_times, :invites)
        .where(invites: { status: :active })
        .order('entry_times.updated_at DESC')
    }

    has_paper_trail

    class Unauthorized < StandardError; end

    GRANT_STATE = %w[Pending Granted Denied].freeze

    ENTRY_REQUEST_STATE = %w[Active Revoked].freeze

    # granted_state: 1 granted
    # granted_state: 2 denied
    # granted_state: 3 granted for a scanned entry
    def grant!(grantor, type = 'event')
      update(
        grantor_id: grantor.id,
        granted_state: type == 'event' ? 1 : 3,
        granted_at: Time.zone.now,
        exited_at: nil,
      )
      log_entry_start('granted') if type == 'event'
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

    def closest_entry_time
      closest_start_entry = find_closest_entry(:start)
      closest_end_entry = find_closest_entry(:end)
      return if closest_start_entry.blank? && closest_end_entry.blank?

      active_entry_time?(closest_end_entry) ? closest_end_entry : closest_start_entry
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
      link = "https://#{HostEnv.base_url(user.community)}/feedback"
      Rails.logger.info "Phone number to send #{number}"
      # disabled rubocop to keep the structure of the message
      Sms.send(number, I18n.t('general.thanks_for_using_our_app', feedback_link: link))
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

    def find_closest_entry(for_time)
      entry_times.where.not(visitation_date: nil).min do |a, b|
        (Time.zone.now - visit_date_time(a, for_time)).abs <=>
          (Time.zone.now - visit_date_time(b, for_time)).abs
      end
    end

    def visit_date_time(entry_time, for_time)
      return if entry_time.blank?

      date = entry_time.visitation_date&.to_date
      time = for_time.eql?(:start) ? entry_time.starts_at&.time : entry_time.ends_at&.time

      (date + time.seconds_since_midnight.seconds).to_datetime
    end

    def active_entry_time?(entry_time)
      Time.zone.now >= visit_date_time(entry_time, :start) &&
        Time.zone.now <= visit_date_time(entry_time, :end)
    end
  end
  # rubocop:enable Metrics/ClassLength
end
