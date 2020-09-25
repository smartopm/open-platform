# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PointsAutoAlertJob, type: :job do
  let!(:community) do
    create(:community, templates: {
             points_auto_alert_template_id: 'fgcagv5r2yr67',
           })
  end
  let!(:user) { create(:user, community: community, user_type: 'client') }

  describe '#perform' do
    it 'enqueues the job' do
      expect do
        PointsAutoAlertJob.perform_later
      end.to have_enqueued_job
    end

    it 'invokes EmailMsg' do
      expect(EmailMsg).to receive(:send_mail).with(user.email, 'fgcagv5r2yr67')
      perform_enqueued_jobs { described_class.perform_later }
    end
  end
end
