# frozen_string_literal: true

# Populates activity_points
class ActivityPointsJob < ApplicationJob
  queue_as :default

  ACTIONS = {
    user_login: :login,
    user_referred: :referral,
    user_comment: :comment,
    post_read: :article,
  }.freeze

  # Should we get this from user's community instead?
  TIME_ZONE = 'Africa/Lusaka'

  def perform(user_id, action)
    user = User.find(user_id)
    return unless user
    return if action == "user_login" && !user_first_login_today?(user)

    if ACTIONS.keys.include?(action.to_sym)
      point = action_point(action)
      current_week_activity_point = activity_point_for_current_week(user)

      if current_week_activity_point.present?
        current_week_activity_point.increment!(ACTIONS[action.to_sym], point)
      else
        ActivityPoint.create!(user: user, ACTIONS[action.to_sym] => point)
      end
    end
  end

  private

  def user_first_login_today?(user)
    user_logins_today = EventLog.where(
      "acting_user_id = ? AND subject = ? AND created_at >= ?",
      user.id, "user_login", current_time_in_timezone.beginning_of_day
    )
    user_logins_today.length == 1
  end

  def current_time_in_timezone
    Time.now.in_time_zone(TIME_ZONE)
  end

  def action_point(action)
    case action
    when "user_referred"
      10
    else
      1
    end
  end

  def activity_point_for_current_week(user)
    last_monday = if current_time_in_timezone.monday?
      current_time_in_timezone.beginning_of_day
    else
      current_time_in_timezone.prev_occurring(:monday).beginning_of_day
    end

    user.activity_points.where("created_at >= ?", last_monday).first
  end
end
