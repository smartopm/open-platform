# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CheckUnsubscribedUsersJob, type: :job do
  describe '#perform_later' do
    it 'should enqueue a job to check users who unsubscribed from emails' do
      community = FactoryBot.create(:community)
      ActiveJob::Base.queue_adapter = :test
      expect do
        CheckUnsubscribedUsersJob.perform_later(community.name)
      end.to have_enqueued_job
    end
  end
end
