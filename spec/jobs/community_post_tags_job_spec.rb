# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CommunityPostTagsJob, type: :job do
  let!(:user) { create(:user_with_community) }

  describe '#perform_later get community tags' do
    it "should enqueue a job check list of all community tags" do
      community = FactoryBot.create(:community)
      ActiveJob::Base.queue_adapter = :test
      expect do
        CommunityPostTagsJob.perform_later(community.name)
      end.to have_enqueued_job
    end
  end
end
