# frozen_string_literal: true

namespace :db do
  desc 'Create general funds for unallocated transaction amount'
  task create_general_fund_entries_for_unalloacted_funds: :environment do
    ActiveRecord::Base.transaction do
      Payments::Transaction.accepted.find_each do |transaction|
        payments_amount = transaction.plan_payments.paid.sum(:amount)
        unallocated_amount = transaction.amount - payments_amount
        next unless unallocated_amount.positive?

        user = transaction.user
        user.general_payment_plan.plan_payments.create!(amount: unallocated_amount,
                                                        user_id: user.id,
                                                        community_id: user.community_id,
                                                        transaction_id: transaction.id,
                                                        status: :paid)
        puts "Created general fund entry for user #{user.name} id: #{user.id}, " \
        "transaction_id: #{transaction.id}"
      end
    end
  rescue StandardError => e
    puts 'Failed to create general funds entry'
    puts e.message.to_s
  end
end
