# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
# rubocop:disable Layout/LineLength
namespace :migrate_deposits do
  desc 'Reset payment plan pending balance and migrate deposit entry in transactions table'
  task :reset_plans_and_migrate_deposit_in_transactions, [:community_name] => :environment do |_t, args|
    errors = {}
    warning = {}
    community = Community.find_by(name: args.community_name)

    ActiveRecord::Base.transaction do
      community.land_parcels.each do |parcel|
        plan = parcel.payment_plan
        next if plan.blank?

        if plan.monthly_amount.nil? || plan.duration_in_month.nil?
          warning["payment_plan_#{plan.id}"] = "Can not update plot balance or migrate deposit for plan #{plan.id} because either monthly amount or duration_in_month is not present."
          next
        end

        plan_balance = plan.pending_balance
        plan.update!(pending_balance: plan.monthly_amount * plan.duration_in_month)
        puts "Reset payment plan of land parcel #{parcel.parcel_number}"

        wallet_transactions = plan.wallet_transactions
                                  .not_cancelled
                                  .where.not('source = ? OR destination = ?', 'invoice', 'invoice')
        wallet_transactions.each do |wallet_transaction|
          user = wallet_transaction.user
          status = wallet_transaction.status == 'settled' ? 'accepted' : wallet_transaction.status

          transaction = user.transactions.create(
            amount: wallet_transaction.amount,
            bank_name: wallet_transaction.bank_name,
            cheque_number: wallet_transaction.cheque_number,
            created_at: wallet_transaction.created_at,
            community_id: wallet_transaction.community_id,
            depositor_id: wallet_transaction.depositor_id,
            originally_created_at: wallet_transaction.originally_created_at,
            receipt_number: wallet_transaction.receipt_number,
            status: status,
            source: wallet_transaction.source,
            transaction_number: wallet_transaction.transaction_number,
          )
          unless transaction.persisted?
            errors["wallet_transaction_#{wallet_transaction.id}"] = transaction.errors.full_messages
            next
          end
          amount_paid = plan.allocated_amount(transaction.amount)

          next unless amount_paid.positive?

          plan.update_pending_balance(transaction.amount)
          transaction.plan_payments.create!(
            amount: amount_paid,
            community_id: transaction.community_id,
            created_at: transaction.created_at,
            payment_plan_id: plan.id,
            status: 'paid',
            user_id: transaction.user_id,
          )
        end
        if plan_balance != plan.reload.pending_balance
          errors["payment_plan_#{plan.id}"] = "Something went wrong for payment plan #{plan.id}. Payment plan pending balance is updated incorrectly as it was in its initial stage."
        end
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end
    puts "Errors: #{errors}"
    puts "Warning: #{warning}"
    puts 'Records successfully migrated' if errors.empty?
  end
end
# rubocop:enable Metrics/BlockLength
# rubocop:enable Layout/LineLength
