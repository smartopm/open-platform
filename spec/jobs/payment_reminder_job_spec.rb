# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PaymentReminderJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:admin) { create(:admin_user, community_id: community.id) }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) { create(:payment_plan, user: user, land_parcel: land_parcel) }
  let!(:template) do
    create(:email_template, name: 'payment_reminder_template', community: community)
  end
  describe '#perform' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
    end
    it 'enqueues the job' do
      expect do
        described_class.perform_later(user, payment_plan)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(user, payment_plan)

      expect(PaymentReminderJob).to have_been_enqueued.with(user, payment_plan)
    end

    context 'when template is found' do
      before do
        community.templates = { 'payment_reminder_template_behind' => template.id.to_s }
        community.save
      end
      it 'invokes EmailMsg' do
        template_data = [
          { key: '%client_name%', value: user.name },
          { key: '%parcel_number%', value: payment_plan.land_parcel.parcel_number },
          { key: '%outstanding_days%', value: payment_plan.outstanding_days.to_s },
          { key: '%owing_amount%', value: payment_plan.owing_amount.to_s },
        ]

        expect(EmailMsg).to receive(:send_mail_from_db).with(
          user.email, template, template_data
        )
        perform_enqueued_jobs { described_class.perform_later(user, payment_plan) }
      end
    end
  end
end
