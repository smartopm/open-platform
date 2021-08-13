# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CheckCriticalBusinessActivityJob, type: :job do
  describe '#perform_later' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user) }
    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            installment_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 2000)
    end

    before do
      Rails.env.stub(production?: true)
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it 'should enqueue a job to check critical business activity' do
      expect do
        CheckCriticalBusinessActivityJob.perform_later(['Nkwashi', 'Ciudad Morazán'])
      end.to have_enqueued_job
    end

    it 'should not invoke slack when there are activities' do
      user.community.update!(name: 'Nkwashi', slack_webhook_url: 'https://example_webhook.com')
      # record a payment
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 1200)
      # create a gate activity
      event_log = create(:event_log, subject: 'user_entry', ref_type: 'Users::User',
                                     ref_id: user.id, acting_user: user, community: user.community)
      # record a time activity
      user.time_sheets.create(started_at: Time.current, shift_start_event_log: event_log)

      expect(Slack).not_to receive(:new)
      perform_enqueued_jobs { described_class.perform_later(['Nkwashi']) }
    end

    it 'invokes slack when no activity' do
      user.community.update!(name: 'Nkwashi', slack_webhook_url: 'https://example_webhook.com')

      expect(Slack).to receive(:new).at_least(3).times.with(
        'https://example_webhook.com',
      )
      perform_enqueued_jobs { described_class.perform_later(['Nkwashi']) }
    end
  end
end
