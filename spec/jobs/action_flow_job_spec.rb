# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlowJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:event_log) do
    create(:event_log, acting_user: user, community: user.community,
                       subject: 'user_enrolled',
                       data: {})
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
        described_class.perform_later(event_log)
      end.to have_enqueued_job
    end
  end
end
