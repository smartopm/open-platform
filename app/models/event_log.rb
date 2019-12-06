# frozen_string_literal: true

# A list of all activity for a particular community
class EventLog < ApplicationRecord
  belongs_to :community
  belongs_to :acting_user, optional: true, class_name: 'User'

  after_create :update_user, :notify_slack
  validate :validate_log, :validate_acting_user

  default_scope { order(created_at: :asc) }

  VALID_SUBJECTS = %w[user_entry visitor_entry].freeze
  validates :subject, inclusion: { in: VALID_SUBJECTS, allow_nil: false }

  def visitor_entry?
    subject == 'visitor_entry'
  end

  def user_entry?
    subject == 'user_entry'
  end

  # Hand back a human description of the event
  def to_sentence
    if visitor_entry?
      visitor_entry_to_sentence
    else
      user_entry_to_sentence
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

  private

  def validate_acting_user
    return unless acting_user

    return if acting_user.community_id == community_id

    errors.add(:acting_user, 'Can only report users in your own community')
  end

  def validate_log
    if visitor_entry?
      validate_visitor_entry
    elsif user_entry?
      validate_user_entry
    end
  end

  def validate_visitor_entry
    errors.add(:data, 'Visitor name required') unless data['visitor_name']
    return if acting_user

    errors.add(:acting_user_id, 'Must be associated with a reporting user')
  end

  def validate_user_entry
    errors.add(:object_id, 'Must be associated with a user') unless object_id
    errors.add(:acting_user, 'Must be associated with a reporting user') unless acting_user
  end

  def update_user
    return unless ref_type == 'User'

    User.find(ref_id).update(last_activity_at: Time.zone.now)
  end

  def notify_slack
    SlackNotification.perform_later(community, to_sentence) if to_sentence
  end
end
