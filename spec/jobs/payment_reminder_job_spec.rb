# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PaymentReminderJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:admin) { create(:admin_user, community_id: community.id) }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, user: user, land_parcel: land_parcel,
                          start_date: Time.zone.today - 6.months)
  end
  let!(:other_payment_plan) do
    create(:payment_plan, user: user, land_parcel: land_parcel,
                          start_date: Time.zone.today)
  end
  let!(:template) do
    create(:email_template, name: 'payment_reminder_template', community: community)
  end
  let!(:payment_reminder_fields) do
    [{ user_id: user.id, payment_plan_id: payment_plan.id },
     { user_id: user.id, payment_plan_id: other_payment_plan.id }]
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
        described_class.perform_later(community, payment_reminder_fields)
      end.to have_enqueued_job
    end

    it 'enqueues job with matched arguments' do
      described_class.perform_later(community, payment_reminder_fields)

      expect(PaymentReminderJob).to have_been_enqueued.with(community, payment_reminder_fields)
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
          { key: '%installment_amount', value: payment_plan.installment_amount.to_s },
          { key: '%upcoming_installment_due_date%',
            value: payment_plan.upcoming_installment_due_date.to_date.to_s },
        ]

        expect(EmailMsg).to receive(:send_mail_from_db).with(
          email: user.email,
          template: template,
          template_data: template_data,
        )
        perform_enqueued_jobs { described_class.perform_later(community, payment_reminder_fields) }
      end
    end
  end
end
