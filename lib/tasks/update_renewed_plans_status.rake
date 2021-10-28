# frozen_string_literal: true

namespace :db do
  desc 'Update renewed plans status from completed to active'
  task update_renewed_plans_status: :environment do
    ActiveRecord::Base.transaction do
      plans = Properties::PaymentPlan.where(status: :completed).where.not(pending_balance: 0)
      plans_count = plans.count
      plans.find_each do |plan|
        plan.update!(status: :active)
      end
      puts "Updated #{plans_count} payment plans"
    end
  rescue StandardError => e
    puts 'Failed to update payment plan'
    puts e.message.to_s
  end
end
