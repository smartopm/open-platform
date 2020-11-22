# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TaskReminderJob, type: :job do
  let!(:community) do
    create(:community, templates: {
             task_reminder_template_id: 'fgcagv5r2yr67',
           })
  end
  let!(:user) { create(:user_with_community) }
  let!(:admin) { create(:admin_user, community_id: community.id) }
  let!(:note) do
    admin.notes.create!(
      body: 'Note body',
      user_id: user.id,
      community_id: user.community_id,
      author_id: admin.id,
    )
  end
  let!(:assignee_note) { create(:assignee_note, user: admin, note: note) }

  describe '#perform' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
    end
    it 'enqueues the job' do
      expect do
        described_class.perform_later(note.id, admin.id)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(assignee_note)

      expect(TaskReminderJob).to have_been_enqueued.with(assignee_note)
    end

    it 'invokes EmailMsg' do
      expect(EmailMsg).to receive(:send_mail).with(
        admin.email, 'fgcagv5r2yr67', "url": "#{ENV['HOST']}/todo/#{note.id}"
      )
      perform_enqueued_jobs { described_class.perform_later(assignee_note) }
    end
  end
end
