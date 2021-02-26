# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CheckUnsubscribedUsersJob, type: :job do
  describe '#perform_later' do
    let!(:user) { create(:user_with_community) }

    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'should enqueue a job to check users who unsubscribed from emails' do
      expect do
        CheckUnsubscribedUsersJob.perform_later(user.community.name)
      end.to have_enqueued_job
    end

    it 'removes com_news_email label from unsubscribed users' do
      prev_user_labels_count = UserLabel.count
      allow(EmailMsg).to receive(:fetch_unsubscribes_list).and_return(User.where(id: user.id))
      expect(EmailMsg).to receive(:fetch_unsubscribes_list).with(
        Time.zone.now.beginning_of_week.to_i,
      )
      perform_enqueued_jobs { described_class.perform_later(user.community.name) }
      expect(UserLabel.count).to eq(prev_user_labels_count - 1)
    end
  end
end
