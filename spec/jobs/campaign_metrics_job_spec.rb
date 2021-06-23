# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CampaignMetricsJob, type: :job do
  let!(:current_user) { create(:user_with_community) }
  let!(:campaign) { create(:campaign, community: current_user.community) }

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
        CampaignMetricsJob.perform_later(campaign.id, current_user.id)
      end.to have_enqueued_job
    end

    it 'performs enqueued job' do
      expect(Logs::EventLog).to receive_message_chain(
        :since_date,
        :by_user_activity,
        :with_acting_user_id,
        :group_by,
        :count,
      )
      allow(described_class).to receive_message_chain(:set, :perform_later).and_return(nil)

      perform_enqueued_jobs { described_class.perform_later(campaign.id, current_user.id) }
    end
  end
end
