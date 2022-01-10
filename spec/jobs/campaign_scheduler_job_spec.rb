# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CampaignSchedulerJob, type: :job do
  let!(:community) { create(:community) }
  let!(:user) { create(:user, community: community) }
  let!(:admin) { create(:admin_user, community: community) }
  let!(:campaign) do
    create(:campaign, status: 'scheduled',
                      community_id: community.id, campaign_type: 'sms',
                      message: 'test', batch_time: Time.current - 5.minutes)
  end

  describe '#perform' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end

    after do
      clear_enqueued_jobs
    end

    it 'enqueues the job' do
      expect do
        described_class.perform_later(campaign.id)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(campaign.id)

      expect(CampaignSchedulerJob).to have_been_enqueued.with(campaign.id)
    end

    context 'when job is executed' do
      it 'executes run_campaign' do
        perform_enqueued_jobs { described_class.perform_now(campaign.id) }
        expect(campaign.reload.status).to eql 'done'
      end
    end
  end
end
