# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlowJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:event_log) do
    create(:event_log, acting_user: user, community: user.community,
                       subject: 'user_login',
                       data: {})
  end

  let!(:action_flow) do
    create(:action_flow, event_action: {
             action_name: 'Email', action_fields: {
               email: { name: 'email', value: 'email@gmail.com', type: 'string' },
             }
           },
                         community: user.community, event_type: 'user_login')
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

    it 'initializes ActionFlows::WebFlow' do
      expect(ActionFlows::WebFlow).to receive(:new)
      perform_enqueued_jobs { described_class.perform_later(event_log) }
    end

    it 'enqueues the job when extra data is passed' do
      expect do
        described_class.perform_later(event_log, { 'password': 'sd334451' })
      end.to have_enqueued_job
    end
  end
end
