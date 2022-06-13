# frozen_string_literal: true

# rubocop:disable Layout/LineLength
namespace :migrate_deposits do
  desc 'Reset payment plan pending balance and migrate deposit entry in transactions table'
  task :reset_plans_and_migrate_deposit_in_transactions, [:community_name] => :environment do |_t, args|
    errors = {}
    warning = {}
    community = Community.find_by(name: args.community_name)

    ActiveRecord::Base.transaction do
      community.land_parcels.excluding_general.joins(:payment_plan).each do |parcel|
        plan = parcel.payment_plan
        wallet_transactions = plan.wallet_transactions
                                  .not_cancelled
                                  .where.not('source = ? OR destination = ?', 'invoice', 'invoice')

        if plan.installment_amount.nil? || plan.duration.nil?
          warning["payment_plan_#{plan.id}"] = "Unable to migrate deposit for user '#{plan.user.name}'. Because either monthly amount or duration_in_month is not present."
          next
        end

        total_pending_balance = plan.installment_amount * plan.duration

        if plan.pending_balance != (total_pending_balance - wallet_transactions.sum(:amount))
          warning["payment_plan_#{plan.id}"] = "Unable to migrate deposit for user '#{plan.user.name}'. Have to handle it manually because there is a data inconsistency with the payment plan."
          next
        end

        plan.update!(pending_balance: total_pending_balance)
        puts "Reset payment plan of land parcel #{parcel.parcel_number}"

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
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end
    puts "Errors: #{errors}"
    puts "Warning: #{warning}"
    puts 'Records successfully migrated' if errors.empty?
  end
end
# rubocop:enable Layout/LineLength
