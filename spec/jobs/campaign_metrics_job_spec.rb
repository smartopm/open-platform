# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CampaignMetricsJob, type: :job do
  let!(:current_user) { create(:user_with_community) }

  describe '#perform_later' do
    it 'should enqueue a job to perform campaign metrics update' do
      campaign = FactoryBot.create(:campaign, community: current_user.community)

      ActiveJob::Base.queue_adapter = :test
      expect do
        CampaignMetricsJob.perform_later(campaign.id, current_user.id)
      end.to have_enqueued_job
    end
  end
end
