# frozen_string_literal: true

require 'email_msg'
# Send payment reminder email
class PaymentReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def perform(user, payment_plan)
    template = user.community.templates&.find { |h| h.key?('payment_reminder_template_behind') }
    template_id = template.presence ? template['payment_reminder_template_behind'] : nil
    email_template = user.community.email_templates.find_by(id: template_id)

    return unless email_template

    template_data = [
      { key: '%client_name%', value: user.name },
      { key: '%parcel_number%', value: payment_plan.land_parcel.parcel_number },
      { key: '%outstanding_days%', value: payment_plan.outstanding_days.to_s },
      { key: '%owing_amount%', value: payment_plan.owing_amount.to_s },
    ]
    EmailMsg.send_mail_from_db(user.email, email_template, template_data)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
