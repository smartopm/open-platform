# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CommunityPostTagsJob, type: :job do
  let!(:user) { create(:user_with_community) }

  describe '#perform_later get community tags' do
    before do
      ActiveJob::Base.queue_adapter = :test
      WebMock.allow_net_connect!
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
      WebMock.disable_net_connect!
    end
    it 'should enqueue a job check list of all community tags' do
      community = FactoryBot.create(:community)
      expect do
        CommunityPostTagsJob.perform_later(community.name)
      end.to have_enqueued_job
    end

    it 'should enqueue with matched arguments' do
      community = FactoryBot.create(:community)
      CommunityPostTagsJob.perform_later(community.name)
      expect(CommunityPostTagsJob).to have_been_enqueued.with(community.name)
    end

    it 'should not create post tag when community name is blank' do
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      CommunityPostTagsJob.perform_later('')
      expect(PostTags::PostTag.count).to eq 0
    end

    it 'should create post tag' do
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true
      community = FactoryBot.create(:community)

      post_tag_count_before = community.post_tags.count
      expect(post_tag_count_before).to eq 0

      CommunityPostTagsJob.perform_later(community.name)
      post_tag_count_after = community.post_tags.count

      expect(post_tag_count_after).not_to eq post_tag_count_before
      expect(post_tag_count_after).to be > post_tag_count_before
    end
  end
end
