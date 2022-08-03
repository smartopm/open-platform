# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PostTagsAlertJob, type: :job do
  let!(:community) { create(:community, templates: { post_alert_template_id: 'fgcagv5r2yr67' }) }
  let!(:user) { create(:user_with_community, community: community) }
  let!(:post_tag) { create(:post_tag, community_id: community.id, slug: 'hir') }

  before do
    Rails.env.stub(production?: true)
    WebMock.allow_net_connect!
  end

  after {  WebMock.disable_net_connect! }

  describe '#perform_later get community tags' do
    it 'should enqueue a job to send email to users if there is a new post' do
      user.post_tags << post_tag
      ActiveJob::Base.queue_adapter = :test
      expect do
        PostTagsAlertJob.perform_later(community.name)
      end.to have_enqueued_job
    end
    it 'does not invoke EmailMsg when no user follows any tag' do
      user.post_tags << post_tag
      allow(URI).to receive(:open).and_return('<html />')
      expect(EmailMsg).not_to receive(:send_mail_from_db)
      perform_enqueued_jobs { described_class.perform_later(community.name) }
    end
  end
end
