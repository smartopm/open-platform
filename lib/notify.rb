# frozen_string_literal: true

# Service to notify user via email and sms
class Notify
  class << self
    def call(user, args = {})
      send_email(user.email, args[:template], args[:template_data])
      send_sms(user.phone_number, args[:sms_body], args[:community])
    end

    private

    def send_email(email, template, template_data)
      return if email.blank? || template.blank?

      EmailMsg.send_mail_from_db(
        email: email,
        template: template,
        template_data: template_data,
      )
    end

    def send_sms(phone_number, sms_body, community)
      return if phone_number.blank? || sms_body.blank?

      Sms.send(phone_number, sms_body)
    end
  end
end
