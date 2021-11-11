# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe GuestQrCodeJob, type: :job do
  let!(:non_admin) { create(:user_with_community) }
  let!(:user) { create(:admin_user, community_id: non_admin.community_id) }
  let!(:entry_req) { user.entry_requests.create(name: 'John Doe', reason: 'Visiting') }
  let!(:template) do
    create(:email_template, name: 'Guest QR Code', community: non_admin.community)
  end

  describe '#perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'enqueues the job' do
      expect do
        described_class.perform_later(community: user.community,
                                      contact_info: { email: 'email@gmail.com' }, entry_request: entry_req)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(community: user.community,
                                    contact_info: { email: 'email@gmail.com' }, entry_request: entry_req)
      expect(GuestQrCodeJob).to have_been_enqueued.with(community: user.community,
                                                        contact_info: { email: 'email@gmail.com' }, entry_request: entry_req)
    end

    it 'invokes EmailMsg' do
      base_url = HostEnv.base_url(user.community)
      qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/' \
                    "?data=#{CGI.escape("https://#{base_url}/request/#{entry_req.id}?type=scan")}&size=256x256"
      request_url = "https://#{base_url}/request/#{entry_req.id}"

      template_data = [
        { key: '%community_name%', value: user.community.name },
        { key: '%qr_code_image%', value: "<img src=#{qr_code_url} />" },
        { key: '%request_url%', value: "<a href=#{request_url}>#{request_url}</a>" },
      ]
      expect(EmailMsg).to receive(:send_mail_from_db).with('email@gmail.com', template, template_data)
      perform_enqueued_jobs do
        described_class.perform_later(community: user.community,
                                      contact_info: { email: 'email@gmail.com' }, entry_request: entry_req, type: 'scan')
      end
    end
  end
end
# rubocop:enable Layout/LineLength
