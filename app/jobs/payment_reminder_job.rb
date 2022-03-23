# frozen_string_literal: true

require 'email_msg'
# Send payment reminder email
class PaymentReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  def perform(community, reminder_details)
    reminder_details.each do |detail|
      user = community.users.find_by(id: detail[:user_id])
      next if user.nil?

      payment_plan = user.payment_plans.find_by(id: detail[:payment_plan_id])
      next if payment_plan.nil? || %w[behind on_track].exclude?(payment_plan.plan_status)

      send_reminder_email(user, payment_plan)
    end
  end

  # rubocop:disable Metrics/MethodLength
  def send_reminder_email(user, payment_plan)
    template_name = if payment_plan.plan_status.eql?('behind')
                      'payment_reminder_template_behind'
                    else
                      'payment_reminder_template_upcoming'
                    end
    template_id = user.community.templates&.dig(template_name)
    email_template = user.community.email_templates.find_by(id: template_id)

    return if email_template.nil? || user.email.blank?

    template_data = [
      { key: '%client_name%', value: user.name },
      { key: '%parcel_number%', value: payment_plan.land_parcel.parcel_number },
      { key: '%outstanding_days%', value: payment_plan.outstanding_days.to_s },
      { key: '%owing_amount%', value: payment_plan.owing_amount.to_s },
      { key: '%installment_amount', value: payment_plan.installment_amount.to_s },
      { key: '%upcoming_installment_due_date%',
        value: payment_plan.upcoming_installment_due_date.to_date.to_s },
    ]
    EmailMsg.send_mail_from_db(
      email: user.email,
      template: email_template,
      template_data: template_data,
    )
  end
  # rubocop:enable Metrics/MethodLength
end
# rubocop:enable Metrics/AbcSize
