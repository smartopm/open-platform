# frozen_string_literal: true

# rubocop:disable Rails/SkipsModelValidations
namespace :db do
  desc 'Update status of payment plans whose pending balance is 0 and status is active'
  task update_status_of_payment_plans: :environment do
    ActiveRecord::Base.transaction do
      Properties::PaymentPlan.where(status: :active, pending_balance: 0)
                             .update_all(status: :completed)
    end
  end
end
# rubocop:enable Rails/SkipsModelValidations
