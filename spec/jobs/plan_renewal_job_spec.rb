# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlanRenewalJob, type: :job do
  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                          installment_amount: 100, start_date: 10.months.ago, frequency: 'monthly',
                          renewable: true)
  end

  let!(:subscription_plan) do
    create(:subscription_plan, community_id: community.id, amount: 200,
                               start_date: 2.months.from_now.beginning_of_month)
  end

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
    it 'creates a new payment plan' do
      expect { perform_enqueued_jobs { described_class.perform_later } }.to(
        change { Properties::PaymentPlan.count }.from(1).to(2),
      )
    end
  end
end
