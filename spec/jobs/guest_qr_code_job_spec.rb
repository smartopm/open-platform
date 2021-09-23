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
        described_class.perform_later(user, 'email@gmail.com', entry_req)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(user, 'email@gmail.com', entry_req)
      expect(GuestQrCodeJob).to have_been_enqueued.with(user, 'email@gmail.com', entry_req)
    end

    it 'invokes EmailMsg' do
      base_url = HostEnv.base_url(user.community)
      qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/' \
                    "?data=#{CGI.escape("https://#{base_url}/request/#{entry_req.id}")}&size=256x256"

      template_data = [
        { key: '%community_name%', value: user.community.name },
        { key: '%qr_code_image%', value: "<img src=#{qr_code_url} />" },
      ]
      expect(EmailMsg).to receive(:send_mail_from_db).with('email@gmail.com', template, template_data)
      perform_enqueued_jobs { described_class.perform_later(user, 'email@gmail.com', entry_req) }
    end
  end
end
# rubocop:enable Layout/LineLength
