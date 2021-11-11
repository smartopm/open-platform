# frozen_string_literal: true

# Service to notify user via email and sms
class Notify
  class << self
    def call(contact_info, args = {})
      send_email(contact_info[:email], args[:template], args[:template_data])
      send_sms(contact_info[:phone_number], args[:sms_body])
    end

    private

    def send_email(email, template, template_data)
      return if email.blank? || template.blank?

      EmailMsg.send_mail_from_db(email, template, template_data)
    end

    def send_sms(phone_number, sms_body)
      return if phone_number.blank? || sms_body.blank?

      Sms.send(phone_number, sms_body)
    end
  end
end
