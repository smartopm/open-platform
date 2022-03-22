# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TaskReminderJob, type: :job do
  let!(:community) do
    create(:community, templates: {
             task_reminder_template_id: 'fgcagv5r2yr67',
           })
  end
  let!(:user) { create(:user, community: community) }
  let!(:admin) { create(:admin_user, community_id: community.id) }
  let!(:note) do
    admin.notes.create!(
      body: 'Note body',
      user_id: user.id,
      community_id: user.community_id,
      author_id: admin.id,
      completed: false,
      due_date: Time.zone.today,
    )
  end
  let!(:assignee_note) { create(:assignee_note, user: admin, note: note) }

  before { Rails.env.stub(production?: true) }
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
      described_class.perform_later('manual', assignee_note)

      expect(TaskReminderJob).to have_been_enqueued.with('manual', assignee_note)
    end

    it 'invokes EmailMsg' do
      template = Notifications::EmailTemplate.system_emails
                                             .create!(
                                               name: 'task_reminder_template',
                                               community: admin.community,
                                             )
      template_data = [
        { key: '%logo_url%', value: admin.community&.logo_url.to_s },
        { key: '%community%', value: admin.community&.name.to_s },
        { key: '%url%', value: "#{ENV['HOST']}/tasks/#{note.id}" },
      ]

      expect(EmailMsg).to receive(:send_mail_from_db).with(
        email: admin.email,
        template: template,
        template_data: template_data,
      )
      perform_enqueued_jobs { described_class.perform_later('manual', assignee_note) }
    end

    it 'invokes EmailMsg and SMS' do
      community.update(features: { 'Tasks' => { 'features' => ['Automated Task Reminders'] } })
      template = Notifications::EmailTemplate.system_emails
                                             .create!(
                                               name: 'task_reminder_template',
                                               community: admin.community,
                                             )
      template_data = [
        { key: '%logo_url%', value: admin.community&.logo_url.to_s },
        { key: '%community%', value: admin.community&.name.to_s },
        { key: '%url%', value: "#{ENV['HOST']}/tasks/#{note.id}" },
      ]
      task_link = "#{HostEnv.base_url(user.community)}/tasks/#{note.id}"
      due_date = note.due_date.to_date.to_s

      expect(EmailMsg).to receive(:send_mail_from_db).with(
        email: admin.email,
        template: template,
        template_data: template_data,
      )
      expect(Sms).to receive(:send).with(
        admin.phone_number, I18n.t('general.task_reminder', due_date: due_date,
                                                            task_link: task_link,
                                                            community_name: user.community.name)
      )
      perform_enqueued_jobs { described_class.perform_later('automated') }
    end
  end
end
