# frozen_string_literal: true

# A list of all activity for a particular community
class EventLog < ApplicationRecord
  belongs_to :community
  belongs_to :acting_user, optional: true, class_name: 'User'

  after_create :notify_slack
  validate :validate_log, :validate_acting_user

  default_scope { order(created_at: :asc) }

  VALID_SUBJECTS = %w[user_entry visitor_entry user_login user_switch user_active].freeze
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
    case subject
    when 'user_entry'
      user_entry_to_sentence
    when 'visitor_entry'
      visitor_entry_to_sentence
    when 'user_login'
      user_login_to_sentence
    when 'user_switch'
      user_switch_to_sentence
    end
  end

  def visitor_entry_to_sentence
    if data['action'] == 'started'
      "#{acting_user.name} started registering #{data['visitor_name']} for entry."
    else
      "#{acting_user.name} #{data['action']} #{data['visitor_name']} for entry."
    end
  end

  def user_entry_to_sentence
    user = User.find(ref_id)
    "User #{user.name} was recorded entering by #{acting_user.name}"
  end

  def user_login_to_sentence
    "User #{acting_user.name} logged in"
  end

  def user_switch_to_sentence
    user = User.find(ref_id)
    "User #{acting_user.name} switched to user #{user.name}"
  end

  def user_active_sentence
    "User #{acting_user.name} was active"
  end

  private

  def validate_acting_user
    return unless acting_user

    return if acting_user.community_id == community_id

    errors.add(:acting_user, 'Can only report users in your own community')
  end

  def validate_log
    case subject
    when 'visitor_entry'
      validate_visitor_entry
    when 'user_entry'
      validate_user_entry
    end
  end

  def validate_visitor_entry
    errors.add(:data, 'Visitor name required') unless data['visitor_name']
    return if acting_user

    errors.add(:acting_user_id, 'Must be associated with a reporting user')
  end

  def validate_user_entry
    errors.add(:ref_id, 'Must be associated with a user') unless ref_id
    errors.add(:acting_user, 'Must be associated with a reporting user') unless acting_user
  end

  def notify_slack
    SlackNotification.perform_later(community, to_sentence) if to_sentence
  end
end
