# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CheckCriticalBusinessActivityJob, type: :job do
  describe '#perform_later' do
    before do
      Rails.env.stub(production?: true)
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'should enqueue a job to check critical business activity' do
      expect do
        CheckCriticalBusinessActivityJob.perform_later(['Nkwashi', 'Ciudad Morazán'])
      end.to have_enqueued_job
    end
  end
end
