# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NotificationCreateJob, type: :job do
  describe '#perform' do
    let(:community) { create(:community) }
    let(:user) { create(:user, community: community) }
    let(:admin) { create(:admin_user, community: community) }
    let(:note) do
      create(:note,
             body: 'Note body',
             user_id: admin.id,
             community_id: community.id,
             author_id: admin.id)
    end
    let(:comment) do
      create(:note_comment,
             note: note,
             user: admin,
             status: 'active',
             body: 'This is the first comment',
             reply_required: true,
             reply_from_id: user.id,
             grouping_id: '9fafaba8-ad19-4a08-97e4-9b670d482cfa')
    end
    let(:args) do
      {
        community_id: community.id,
        notifable_id: comment.id,
        notifable_type: comment.class.name,
        description: I18n.t('notification_description.comment',
                            user: admin.name),
        category: :reply_requested,
        user_id: comment.reply_from_id,
      }
    end

    before do
      ActiveJob::Base.queue_adapter = :test
    end

    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'enqueues the job' do
      expect do
        described_class.perform_later(args)
      end.to have_enqueued_job.with(args)
    end

    context 'when job is executed' do
      it 'creates notifcation' do
        expect do
          described_class.perform_now(args)
        end.to change { Notifications::Notification.count }.by(1)
      end
    end
  end
end
