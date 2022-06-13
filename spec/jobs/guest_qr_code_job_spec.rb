# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe GuestQrCodeJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:admin) { create(:admin_user, community_id: user.community_id) }
  let!(:entry_req) { user.entry_requests.create(name: 'John Doe', reason: 'Visiting') }
  let!(:template) do
    create(:email_template, name: 'Guest QR Code', community: user.community)
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
                                      request_data: [{ user: user, request: entry_req }])
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(community: user.community,
                                    request_data: [{ user: user, request: entry_req }])
      expect(GuestQrCodeJob).to have_been_enqueued.with(community: user.community,
                                                        request_data: [{ user: user, request: entry_req }])
    end

    it 'invokes EmailMsg' do
      expect(EmailMsg).to receive(:send_mail_from_db)
      expect(Sms).to receive(:send)

      perform_enqueued_jobs do
        described_class.perform_later(community: user.community,
                                      request_data: [{ user: user, request: entry_req }], type: 'scan')
      end
    end
  end
end
# rubocop:enable Layout/LineLength
