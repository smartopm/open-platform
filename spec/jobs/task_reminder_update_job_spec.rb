# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TaskReminderUpdateJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:another_user) { create(:user_with_community) }
  let!(:note) { create(:note, user: user, author: another_user) }

  describe '#perform_later' do
    it 'should enqueue a job to update note and delete previously set job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        TaskReminderUpdateJob.perform_later(note.id, user.id)
      end.to have_enqueued_job
    end
  end
end
