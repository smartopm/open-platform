# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PostTagsAlertJob, type: :job do
  let!(:user) { create(:user_with_community) }

  describe '#perform_later get community tags' do
    it "should enqueue a job check list of all community tags" do
      community = FactoryBot.create(:community)
      ActiveJob::Base.queue_adapter = :test
      expect do
        PostTagsAlertJob.perform_later(community.name)
      end.to have_enqueued_job
    end
    it 'does not invoke EmailMsg when no user follows any tag' do
        expect(EmailMsg).not_to receive(:send_mail)
        perform_enqueued_jobs { described_class.perform_later }
      end
  end
end
