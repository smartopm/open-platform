# frozen_string_literal: true

require 'email_msg'
# Send payment reminder email
class PaymentReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def perform(user, payment_plan)
    template = user.community.templates&.find { |h| h.key?('payment_reminder_template') }
    template_id = template.presence ? template['payment_reminder_template'] : nil
    email_template = user.community.email_templates.find_by(id: template_id)

    return unless email_template

    template_data = [
      { key: '%user_name%', value: user.name },
      { key: '%plan_type%', value: payment_plan.plan_type },
      { key: '%plan_value%', value: payment_plan.plan_value },
      { key: '%parcel_number%', value: payment_plan.land_parcel.parcel_number },
      { key: '%owing_amount%', value: payment_plan.owing_amount },
      { key: '%installments_due%', value: payment_plan.installments_due },
      { key: '%community%', value: user.community.name },
    ]
    EmailMsg.send_mail_from_db(user.email, email_template, template_data)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
