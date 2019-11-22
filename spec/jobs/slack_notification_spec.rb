# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SlackNotification, type: :job do
  describe '#perform_later' do
    it 'should enqueue a job to notify slack' do
      community = FactoryBot.create(:community)
      ActiveJob::Base.queue_adapter = :test
      expect do
        SlackNotification.perform_later(community, 'Test message')
      end.to have_enqueued_job
    end
  end
end
