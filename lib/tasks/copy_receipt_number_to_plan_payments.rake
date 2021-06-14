# frozen_string_literal: true

desc 'Copy receipt number from transactions'
task copy_receipt_number_to_plan_payments: :environment do
  puts 'Copying receipt numbers ...'
  payments = Payments::PlanPayment.joins(:user_transaction).where
                                  .not(transactions: { receipt_number: nil })
  payments.each do |payment|
    payment.update(manual_receipt_number: payment.user_transaction.receipt_number)
  end
end
