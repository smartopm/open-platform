# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlanRenewalJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                          installment_amount: 100, start_date: 10.months.ago, frequency: 'monthly',
                          renewable: true, status: :completed)
  end

  let!(:subscription_plan) do
    create(:subscription_plan, community_id: community.id, amount: 200,
                               start_date: 2.months.from_now.beginning_of_month)
  end
  let!(:email_template) do
    create(:email_template, name: 'Project Panther', community_id: community.id)
  end
  let!(:template_data) { [{ key: '%end_date%', value: payment_plan.end_date }] }

  before do
    ActiveJob::Base.queue_adapter = :test
  end
  after do
    clear_enqueued_jobs
    clear_performed_jobs
  end

  describe '#PlanRenewalJob' do
    it 'should enqueue a job to renew payment plans' do
      expect do
        described_class.perform_later
      end.to have_enqueued_job
    end
    it 'creates a new payment plan and invokes EmailMsg' do
      expect(Properties::PaymentPlan.count).to eql 1
      expect(EmailMsg).to receive(:send_mail_from_db).with(
        email: user.email,
        template: email_template,
        template_data: template_data,
      )

      perform_enqueued_jobs { described_class.perform_later(false) }
      expect(Properties::PaymentPlan.count).to eql 2
      expect(Properties::PaymentPlan.order(:created_at).last.status).to eql 'active'
    end
    it 'does not create a new plan for dry run' do
      expect { perform_enqueued_jobs { described_class.perform_later(true) } }.to(
        change { Properties::PaymentPlan.count }.by(0),
      )
    end

    context 'when email is not present' do
      before { user.update(email: '') }
      it 'does not invokes EmailMsg' do
        expect(Properties::PaymentPlan.count).to eql 1
        expect(EmailMsg).not_to receive(:send_mail_from_db).with(
          email: user.email,
          template: email_template,
          template_data: template_data,
        )

        perform_enqueued_jobs { described_class.perform_later(false) }
        expect(Properties::PaymentPlan.count).to eql 2
      end
    end
  end
end
