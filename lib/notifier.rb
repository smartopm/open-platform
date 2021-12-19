# frozen_string_literal: true

# class helper to handle sending of notifications in the app
class Notifier
  class UninitializedError < StandardError; end
  class NotifierError < StandardError; end

  # rubocop:disable Metrics/MethodLength
  # public interface used by the notification action in action_flows
  def self.send_from_action(message_body, data = {})
    label = data[:label]
    user_id = data[:user_id]

    return if label.blank? && user_id.blank?

    users_to_notify = user_list_from_label(label) || [user_id]

    return if users_to_notify.blank?

    short_desc = 'Notification sent from Action Flow'
    community_id = community_id(label, user_id)

    users_to_notify.each do |user|
      send_in_app_notification(
        user,
        message_body: message_body,
        short_desc: short_desc,
        community_id: community_id,
      )
    end
  end
  # rubocop:enable Metrics/MethodLength

  def self.user_list_from_label(short_desc)
    label = label(short_desc)

    return label.users.pluck(:id) if label

    nil
  end

  def self.label(short_desc)
    return nil if short_desc.blank?

    Labels::Label.where(short_desc: short_desc).first
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.community_id(label, user_id)
    return nil if label.blank? && user_id.blank?

    label(label)&.community&.id || user(user_id)&.community&.id
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.user(user_id)
    return nil if user_id.blank?

    Users::User.where(id: user_id)
               .includes(:community).first
  end

  # rubocop:disable Metrics/MethodLength
  def self.send_in_app_notification(user, data = {})
    return if user.blank? || data[:community_id].nil?

    ActiveRecord::Base.transaction do
      # TODO: we might need to create a category for notifications instead of 'sms' - @Nicolas
      # TODO: we might also need a bot user account to serve as 'sender', whenever notifications
      # are sent from within the app - @Nicolas
      new_message = Notifications::Message.create!(
        user_id: user,
        message: data[:message_body] || '',
        category: 'sms',
        sender_id: user,
      )

      Notifications::Notification.create!(
        notifable_id: new_message[:id],
        notifable_type: 'Notifications::Message',
        user_id: user,
        description: data[:short_desc] || '',
        community_id: data[:community_id],
      )

      # fail gracefully
    rescue StandardError => e
      Rails.logger.warn e.full_message
    end
  end
  # rubocop:enable Metrics/MethodLength
end
