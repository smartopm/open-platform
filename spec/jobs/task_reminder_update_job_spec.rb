# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TaskReminderUpdateJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:another_user) { create(:user, community: community, role: user.role) }
  let!(:admin) { create(:admin_user, community_id: user.community_id) }
  let!(:note) { create(:note, user: user, author: another_user) }
  let!(:assignee_note) { admin.assignee_notes.create!(note: note) }
  new_job_id = '1234567'

  describe '#perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end
    it 'should match enqueued job arguments' do
      TaskReminderUpdateJob.perform_later(assignee_note, new_job_id)
      expect(TaskReminderUpdateJob).to have_been_enqueued.with(assignee_note, new_job_id)
    end
    it 'should enqueue a job to update note and delete previously set job' do
      TaskReminderUpdateJob.perform_later(assignee_note, new_job_id)
      expect(TaskReminderUpdateJob).to have_been_enqueued
    end
    it 'should update assignee_note reminder_job_id with new job id' do
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      TaskReminderUpdateJob.perform_later(assignee_note, new_job_id)

      updated_assignee_note = Notes::AssigneeNote.find(assignee_note.id)
      expect(updated_assignee_note.reminder_job_id).to eq(new_job_id)
    end
  end
end
