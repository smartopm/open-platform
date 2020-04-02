# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength

# A list of all activity for a particular community
class EventLog < ApplicationRecord
  belongs_to :community
  belongs_to :acting_user, optional: true, class_name: 'User'

  after_create :notify_slack
  validate :validate_log, :validate_acting_user

  default_scope { order(created_at: :desc) }

  VALID_SUBJECTS = %w[user_entry visitor_entry user_login user_switch user_enrolled
                      user_active user_feedback showroom_entry user_update].freeze
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

  def user_feedback_to_sentence
    # send a message of the newest feedback
    feedback = Feedback.last
    "User #{acting_user_name} gave thumbs #{feedback.is_thumbs_up == true ? 'up' : 'down'} feedback"
  end

  def showroom_entry_to_sentence
    user = EntryRequest.last
    "User #{user.name} was recorded in the showroom"
  end

  def user_update_to_sentence
    "#{ref_user_name} was updated by #{acting_user_name}"
  end

  def user_enrolled_to_sentence
    new_user = User.order('created_at').last
    "#{new_user[:name]} was enrolled"
  end

  def ref_user_name
    user = User.find_by(id: ref_id)
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
    errors.add(:data, 'Visitor name required') unless data['ref_name']
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

  def deleted_user?
    return true if acting_user_id && acting_user.nil?
  end
end
# rubocop:enable Metrics/ClassLength
