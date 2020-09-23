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

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def perform(user_id, action)
    user = User.find(user_id)
    return unless user
    return if action == 'user_login' && !user.first_login_today?
    return unless ACTIONS.keys.include?(action.to_sym)

    point = action_point(action)
    current_week_activity_point = user.activity_point_for_current_week
    if current_week_activity_point.present?
      # rubocop:disable Rails/SkipsModelValidations
      current_week_activity_point.increment!(ACTIONS[action.to_sym], point)
      # rubocop:enable Rails/SkipsModelValidations
    else
      ActivityPoint.create!(user: user, ACTIONS[action.to_sym] => point)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  def action_point(action)
    case action
    when 'user_referred'
      10
    else
      1
    end
  end
end
