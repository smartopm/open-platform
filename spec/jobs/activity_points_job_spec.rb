# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityPointsJob, type: :job do
  let!(:user) { create(:user_with_community) }

  describe '#perform_later' do
    it "should enqueue a job to populate user's activity points" do
      ActiveJob::Base.queue_adapter = :test
      expect do
        ActivityPointsJob.perform_later(user.id, 'user_referred')
      end.to have_enqueued_job
    end
  end
end
