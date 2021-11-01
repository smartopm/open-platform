# frozen_string_literal: true

require 'email_msg'
require 'host_env'

# Send qr-code to a registered guest
# rubocop:disable Layout/LineLength
class GuestQrCodeJob < ApplicationJob
  queue_as :default

  def perform(current_user, guest_email, entry_req, type)
    template = current_user.community.email_templates.find_by(name: 'Guest QR Code')
    return unless template

    base_url = HostEnv.base_url(current_user.community)
    qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/' \
                  "?data=#{CGI.escape("https://#{base_url}/request/#{entry_req.id}?type=#{type}")}&size=256x256"

    template_data = [
      { key: '%community_name%', value: current_user.community.name },
      { key: '%qr_code_image%', value: "<img src=#{qr_code_url} />" },
    ]

    EmailMsg.send_mail_from_db(guest_email, template, template_data)
  end
end
# rubocop:enable Layout/LineLength
