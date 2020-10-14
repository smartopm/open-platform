# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TaskReminderJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:admin) { create(:admin_user, community_id: user.community_id) }
  let!(:note) do
    admin.notes.create!(
      body: 'Note body',
      user_id: user.id,
      community_id: user.community_id,
      author_id: admin.id,
    )
  end
  before { Rails.env.stub(production?: true) }

  describe '#perform' do
    it 'enqueues the job' do
      expect do
        described_class.perform_later(note.id, admin.id)
      end.to have_enqueued_job
    end

    # it 'invokes EmailMsg' do
    #   expect(EmailMsg).to receive(:send_mail).with(admin.email, 'fgcagv5r2yr67', 'url': ENV['HOST'])
    #   perform_enqueued_jobs { described_class.perform_later(note.id, admin.id) }
    # end
  end
end
