# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CampaignMetricsJob, type: :job do
  let!(:current_user) { create(:user_with_community) }
  let!(:campaign) do
    create(:campaign, community: current_user.community, status: :done, campaign_type: 'email',
                      end_time: Time.zone.now - 1.day)
  end
  let(:mock_response) do
    [
      OpenStruct.new(
        opens_count: 4,
        clicks_count: 2,
      ), OpenStruct.new(
        opens_count: 2,
        clicks_count: 0,
      )
    ]
  end

  describe '#perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'should enqueue a job to perform campaign metrics update' do
      expect do
        CampaignMetricsJob.perform_later(campaign.id, current_user.id, Time.zone.now)
      end.to have_enqueued_job
    end

    context 'when job is executed' do
      before do
        allow(EmailMsg).to receive(:email_stats).with(any_args).and_return(mock_response)
      end

      it 'updates campaign statistics' do
        perform_enqueued_jobs { described_class.perform_now }
        expect(campaign.reload.total_opened).to eql 2
        expect(campaign.total_clicked).to eql 1
      end
    end
  end
end
