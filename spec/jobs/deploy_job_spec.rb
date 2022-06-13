# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DeployJob, type: :job do
  describe '#perform_later' do
    before do
      Rails.env.stub(production?: true)
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'enqueues the job' do
      expect do
        described_class.perform_later('token')
      end.to have_enqueued_job
    end

    it 'invokes Deploy class' do
      expect(Deploy).to receive(:create_tag!).with('token')
      perform_enqueued_jobs { described_class.perform_later('token') }
    end
  end
end
