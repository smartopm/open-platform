# frozen_string_literal: true

require 'email_msg'
require 'host_env'
require 'notify'
# Send qr-code to a registered guest
# rubocop:disable Layout/LineLength
class GuestQrCodeJob < ApplicationJob
  queue_as :default

  # TODO: handle multiple users here
  # rubocop:disable Metrics/MethodLength
  def perform(community:, contact_infos:, type:)
    template = community.email_templates.find_by(name: 'Guest QR Code')
    base_url = HostEnv.base_url(community)

    # TODO: start the loop here

    contact_infos.each do |user|
      qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/' \
                    "?data=#{CGI.escape("https://#{base_url}/request/#{user[:request].id}?type=#{type}")}&size=256x256"
      request_url = "https://#{base_url}/request/#{user[:request].id}"

      template_data = [
        { key: '%community_name%', value: community.name },
        { key: '%qr_code_image%', value: "<img src=#{qr_code_url} />" },
        { key: '%request_url%', value: "<a href=#{request_url}>#{request_url}</a>" },
      ]

      Notify.call(user, template: template,
                                template_data: template_data,
                                sms_body: I18n.t('general.guest_invite_message',
                                                 invite_link: request_url, community_name: community.name))

    end

  end
  # rubocop:enable Metrics/MethodLength
end
# rubocop:enable Layout/LineLength
