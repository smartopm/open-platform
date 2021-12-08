# frozen_string_literal: true

namespace :db do
  desc 'Allocate general funds to renewed plans'
  task allocate_general_funds_to_renewed_plans: :environment do
    ActiveRecord::Base.transaction do
      Properties::PaymentPlan.where.not(renewed_plan_id: nil).find_each do |plan|
        renewed_plan = Properties::PaymentPlan.find_by(id: plan.renewed_plan_id)
        user = renewed_plan.user
        next if user.payment_plans.general.nil?

        renewed_plan.send(:allocate_general_funds)
        puts "Allocated funds for plan with id: #{renewed_plan.id} for #{user.name}"
      end
    end
  rescue StandardError => e
    puts 'Failed to allocate general fund'
    puts e.message.to_s
  end
end
