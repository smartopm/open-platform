# frozen_string_literal: true

desc 'update Notification notifiable type Message to Notifications::Message'
task update_notifiable_type_of_notifications: :environment do
  puts '===== Updating notifiable type of Message to Notifications::Message ====='
  message_notifications = Notifications::Notification.where(notifable_type: 'Message')
  # rubocop:disable Rails/SkipsModelValidations
  message_notifications.update_all(notifable_type: 'Notifications::Message')
  # rubocop:enable Rails/SkipsModelValidations
  puts '===== Updated notifiable type to Notifications::Message ====='
end
