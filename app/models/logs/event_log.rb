# frozen_string_literal: true

module Logs
  # rubocop:disable Metrics/ClassLength
  # A list of all activity for a particular community
  class EventLog < ApplicationRecord
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
                        user_active user_feedback showroom_entry user_update user_temp
                        shift_start shift_end user_referred post_read post_shared
                        task_create task_update note_comment_create note_comment_update
                        form_create form_update form_publish form_submit form_update_submit
                        visit_request invoice_change deposit_create payment_update
                        observation_log task_assign].freeze
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
        "#{acting_user_name} started registering #{visitor_name} for entry."
      else
        "#{acting_user_name} #{data['action']} #{visitor_name} for entry."
      end
    end

    def user_entry_to_sentence
      "User #{ref_user_name} was recorded entering by #{acting_user_name}"
    end

    def user_login_to_sentence
      "User #{acting_user_name} logged in"
    end

    def user_switch_to_sentence
      "User #{acting_user_name} switched to user #{ref_user_name}"
    end

    def user_active_to_sentence
      "User #{acting_user_name} was active"
    end

    # rubocop:disable Layout/LineLength
    def user_feedback_to_sentence
      # send a message of the newest feedback
      feedback = Users::Feedback.last
      "User #{acting_user_name} gave thumbs #{feedback.is_thumbs_up == true ? 'up' : 'down'} feedback"
    end
    # rubocop:enable Layout/LineLength

    def showroom_entry_to_sentence
      user = EntryRequest.last
      "User #{user.name} was recorded in the showroom"
    end

    def user_update_to_sentence
      "#{ref_user_name} was updated by #{acting_user_name}"
    end

    def user_temp_to_sentence
      "Temperature for #{visitor_name} was recorded by #{acting_user_name}"
    end

    def shift_start_to_sentence
      "Shift for #{ref_user_name} was started by #{acting_user_name}"
    end

    def shift_end_to_sentence
      "Shift for #{ref_user_name} was ended by #{acting_user_name}"
    end

    def user_referred_to_sentence
      "User #{ref_user_name} was referred by #{acting_user_name}"
    end

    def post_read_to_sentence
      "Post #{data['post_id']} was read by #{acting_user_name}"
    end

    def post_shared_to_sentence
      "Post #{data['post_id']} was shared by #{acting_user_name}"
    end

    # form_create form_update form_publish
    def form_create_to_sentence
      "#{acting_user_name} created the form"
    end

    def form_update_to_sentence
      "#{acting_user_name} #{data['action']} #{data['field_name']} field"
    end

    # invoice_change and payment_change
    def invoice_change_to_sentence
      "#{acting_user_name} changed an invoice"
    end

    def deposit_create_to_sentence
      "#{acting_user_name} created a deposit"
    end

    def payment_update_to_sentence
      "#{acting_user_name} made changes to this payment"
    end

    def form_publish_to_sentence
      # published or deleted
      "#{acting_user_name} #{data['action']} the form"
    end

    def observation_log_to_sentence
      "#{acting_user_name} added an observation log to an entry request"
    end

    def task_assign_to_sentence
      "#{acting_user_name} assigned a task"
    end

    def user_enrolled_to_sentence
      new_user = Users::User.order('created_at').last
      "#{new_user[:name]} was enrolled"
    end

    def ref_user_name
      user = Users::User.find_by(id: ref_id)
      if user
        user.name
      else
        "Deleted User(#{ref_id})"
      end
    end

    def acting_user_name
      if deleted_user?
        "Deleted User(#{acting_user_id})"
      else
        acting_user.name
      end
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
