# frozen_string_literal: true

module Logs
  # rubocop:disable Metrics/ClassLength
  # A list of all activity for a particular community
  class EventLog < ApplicationRecord
    has_many_attached :images

    belongs_to :community
    belongs_to :acting_user, optional: true, class_name: 'Users::User'
    belongs_to :ref, polymorphic: true, optional: true

    after_create :populate_activity_points
    after_commit :execute_action_flows
    validate :validate_log, :validate_acting_user

    default_scope { order(created_at: :desc) }
    scope :since_date, ->(date) { where('created_at > ?', date) }
    scope :by_user_activity, -> { where(subject: %w[user_login user_active]) }
    scope :with_acting_user_id, ->(user_ids) { where(acting_user_id: user_ids) }
    scope :post_read_by_acting_user, lambda { |user|
      where(acting_user: user, community: user.community, subject: 'post_read')
    }

    VALID_SUBJECTS = %w[user_entry visitor_entry user_login user_switch user_enrolled
                        user_active user_create user_feedback showroom_entry user_update user_temp
                        shift_start shift_end user_referred post_read post_shared
                        task_create task_update note_comment_create note_comment_update
                        form_create form_update form_publish form_submit form_update_submit
                        visit_request invoice_change deposit_create payment_update
                        observation_log task_assign revoke_guest_entry lead_update].freeze
    validates :subject, inclusion: { in: VALID_SUBJECTS, allow_nil: false }

    # Only log user activity if we haven't seen them
    # in 24 hours. Gives us an idea of daily active users
    def self.log_user_activity_daily(user)
      record = find_by(
        acting_user_id: user, subject: %w[user_active user_login],
        created_at: 24.hours.ago..Float::INFINITY
      )
      return if record

      create(
        subject: 'user_active',
        acting_user: user,
        community: user.community,
      )
    end

    # Hand back a human description of the event
    def to_sentence
      method = "#{subject}_to_sentence".to_sym
      return '' unless respond_to?(method)

      send(method)
    end

    def visitor_name
      data['visitor_name'] || data['ref_name']
    end

    def visitor_entry_to_sentence
      if data['action'] == 'started'
        I18n.t('activerecord.attributes.logs/event_log.sentences.start_visitor_entry_to_sentence',
               acting_user_name: acting_user_name,
               visitor_name: visitor_name)
      end
      I18n.t('activerecord.attributes.logs/event_log.sentences.visitor_entry_to_sentence',
             acting_user_name: acting_user_name,
             visitor_name: visitor_name, action: data['action'])
    end

    def user_entry_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_entry_to_sentence',
             acting_user_name: acting_user_name,
             ref_user_name: ref_user_name)
    end

    def user_login_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_login_to_sentence',
             acting_user_name: acting_user_name)
    end

    def user_switch_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_switch_to_sentence',
             acting_user_name: acting_user_name, ref_user_name: ref_user_name)
    end

    def user_active_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_active_to_sentence',
             acting_user_name: acting_user_name)
    end

    def user_feedback_to_sentence
      # send a message of the newest feedback
      feedback = Users::Feedback.last

      if feedback.is_thumbs_up
        I18n.t('activerecord.attributes.logs/event_log.sentences.thumbs_up_feedback_to_sentence',
               acting_user_name: acting_user_name)
      else
        I18n.t('activerecord.attributes.logs/event_log.sentences.thumbs_down_feedback_to_sentence',
               acting_user_name: acting_user_name)
      end
    end

    def showroom_entry_to_sentence
      user = EntryRequest.last
      I18n.t('activerecord.attributes.logs/event_log.sentences.showroom_entry_to_sentence',
             name: user.name)
    end

    def user_update_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_update_to_sentence',
             ref_user_name: ref_user_name,
             acting_user_name: acting_user_name)
    end

    def user_temp_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_temp_to_sentence',
             visitor_name: visitor_name,
             acting_user_name: acting_user_name)
    end

    def shift_start_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.shift_start_to_sentence',
             ref_user_name: ref_user_name,
             acting_user_name: acting_user_name)
    end

    def shift_end_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.shift_end_to_sentence',
             ref_user_name: ref_user_name,
             acting_user_name: acting_user_name)
    end

    def user_referred_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_referred_to_sentence',
             ref_user_name: ref_user_name,
             acting_user_name: acting_user_name)
    end

    def post_read_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.post_read_to_sentence',
             post_id: data['post_id'],
             acting_user_name: acting_user_name)
    end

    def post_shared_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.post_shared_to_sentence',
             post_id: data['post_id'],
             acting_user_name: acting_user_name)
    end

    # form_create form_update form_publish
    def form_create_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.form_create_to_sentence',
             acting_user_name: acting_user_name)
    end

    def form_update_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.form_update_to_sentence',
             acting_user_name: acting_user_name,
             field_name: data['field_name'],
             action: data['action'])
    end

    # invoice_change and payment_change
    def invoice_change_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.invoice_change_to_sentence',
             acting_user_name: acting_user_name)
    end

    def deposit_create_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.deposit_create_to_sentence',
             acting_user_name: acting_user_name)
    end

    def payment_update_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.payment_update_to_sentence',
             acting_user_name: acting_user_name)
    end

    def form_publish_to_sentence
      # published or deleted
      I18n.t('activerecord.attributes.logs/event_log.sentences.form_publish_to_sentence',
             acting_user_name: acting_user_name,
             action: data['action'])
    end

    def observation_log_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.observation_log_to_sentence',
             acting_user_name: acting_user_name)
    end

    def task_assign_to_sentence
      "#{acting_user_name} assigned a task"
    end

    def user_enrolled_to_sentence
      new_user = Users::User.order('created_at').last
      I18n.t('activerecord.attributes.logs/event_log.sentences.user_enrolled_to_sentence',
             new_user_name: new_user[:name])
    end

    def ref_user_name
      user = Users::User.find_by(id: ref_id)
      if user
        user.name
      else
        I18n.t('activerecord.attributes.logs/event_log.sentences.ref_user_name', ref_id: ref_id)
      end
    end

    def acting_user_name
      if deleted_user?
        I18n.t('activerecord.attributes.logs/event_log.sentences.deleted_user',
               acting_user_id: acting_user_id)
      else
        acting_user.name
      end
    end

    def revoke_guest_entry_to_sentence
      I18n.t('activerecord.attributes.logs/event_log.sentences.revoke_entry_to_sentence',
             acting_user_name: acting_user_name,
             visitor_name: visitor_name,
             action: data['action'])
    end

    # Executes action flows for a event log.
    #
    # @return [void]
    def execute_action_flows
      ActionFlowJob.perform_later(self)
    end

    private

    def validate_acting_user
      return unless acting_user

      return if acting_user.community_id == community_id

      errors.add(:acting_user_id, :allowed_user_reporting_in_own_community)
    end

    def validate_log
      case subject
      when 'visitor_entry'
        validate_visitor_entry
      when 'user_entry'
        validate_user_entry
      end
    end

    # Validates visitor entry,
    # * Adds error if vistor name is not present.
    # * Adds error if acting user is not present.
    #
    # @return [void]
    def validate_visitor_entry
      errors.add(:data, :visitor_name_required) unless data['ref_name']
      return if acting_user

      errors.add(:acting_user_id, :reporting_user_required)
    end

    # Validates user entry,
    # * Adds error if reference is not present.
    # * Adds error if acting user is not present.
    #
    # @return [void]
    def validate_user_entry
      errors.add(:ref_id, :ref_required) unless ref_id
      errors.add(:acting_user_id, :reporting_user_required) unless acting_user
    end

    def deleted_user?
      return true if acting_user_id && acting_user.nil?
    end

    def populate_activity_points
      ActivityPointsJob.perform_now(acting_user.id, subject)
    end
  end
  # rubocop:enable Metrics/ClassLength
end
