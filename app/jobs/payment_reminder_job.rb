# frozen_string_literal: true

require 'email_msg'
# Send payment reminder email
class PaymentReminderJob < ApplicationJob
  queue_as :default

  def perform(user, payment_plan)
    template_id = user.community.templates&.dig('payment_reminder_template_behind')
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
end
