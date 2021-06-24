# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::Wallet, type: :model do
  let!(:user) { create(:user_with_community) }
  let(:community) { user.community }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
  end
  let(:invoice) do
    create(:invoice, community_id: community.id, land_parcel: land_parcel, user_id: user.id,
                     status: 'in_progress', invoice_number: '1234', amount: 100)
  end
  let(:wallet_transaction) do
    community.wallet_transactions.create!(
      user: user,
      status: 1,
      amount: 100,
      source: 'cash',
      payment_plan_id: payment_plan.id,
    )
  end
  let(:uf_transaction) do
    community.wallet_transactions.create!(
      user: user,
      status: 1,
      amount: 50,
      source: 'unallocated_funds',
      payment_plan_id: payment_plan.id,
    )
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:pending_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:currency).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'Instance Methods' do
    describe '#update_balance' do
      context 'when amount is credited' do
        it 'adds balance to the wallet' do
          expect(user.wallet.balance).to eql 0.0
          user.wallet.update_balance(100)
          expect(user.wallet.balance).to eql 100.0
        end
      end

      context 'when amount is debited' do
        it 'debits amount from balance' do
          user.wallet.update_balance(100, 'debit')
          expect(user.wallet.balance).to eql 0.0
          expect(user.wallet.pending_balance).to eql 100.0
        end
      end
    end

    describe '#settle_invoices' do
      context 'when source type is unallocated' do
        before do
          user.wallet.update(unallocated_funds: 120, balance: 120)
          invoice
        end

        context 'when transaction amount is less than invoice amount' do
          before do
            user.wallet.settle_invoices(
              amount: 50, source: 'unallocated_funds', transaction: uf_transaction,
            )
          end

          it 'patially settles pending invoices' do
            expect(user.wallet.pending_balance).to eql 50
            expect(user.wallet.balance).to eql 70
            expect(user.wallet.unallocated_funds).to eql 70
            expect(invoice.reload.pending_amount).to eql 50
            expect(invoice.status).to eql 'in_progress'
            expect(payment_plan.reload.pending_balance).to eql 50
            expect(user.wallet_transactions.count).to eql 2
            expect(
              Payments::PaymentInvoice.where(wallet_transaction_id: uf_transaction.id).count,
            ).to eql 1
          end
        end

        context 'when transaction amount is equal to invoice amount' do
          before do
            uf_transaction.update(amount: 100)
            user.wallet.settle_invoices(
              amount: 100, source: 'unallocated_funds', transaction: uf_transaction,
            )
          end

          it 'settles pending invoices' do
            expect(user.wallet.pending_balance).to eql 0
            expect(user.wallet.balance).to eql 20
            expect(user.wallet.unallocated_funds).to eql 20
            expect(invoice.reload.pending_amount).to eql 0
            expect(invoice.status).to eql 'paid'
            expect(payment_plan.reload.pending_balance).to eql 0
            expect(user.wallet_transactions.count).to eql 2
            expect(
              Payments::PaymentInvoice.where(wallet_transaction_id: uf_transaction.id).count,
            ).to eql 1
          end
        end

        context 'when transaction amount is greater than invoice amount' do
          before do
            uf_transaction.update(amount: 120)
            user.wallet.settle_invoices(
              amount: 120, source: 'unallocated_funds', transaction: uf_transaction,
            )
          end

          it 'settles pending invoices and add remaining amount to unallocated funds' do
            expect(user.wallet.pending_balance).to eql 0
            expect(user.wallet.balance).to eql 20
            expect(user.wallet.unallocated_funds).to eql 20
            expect(invoice.reload.pending_amount).to eql 0
            expect(invoice.status).to eql 'paid'
            expect(payment_plan.reload.pending_balance).to eql 0
            expect(user.wallet_transactions.count).to eql 2
            expect(
              Payments::PaymentInvoice.where(wallet_transaction_id: uf_transaction.id).count,
            ).to eql 1
          end
        end
      end

      context 'when source type is other than unallocated' do
        before do
          invoice
          wallet_transaction
          user.wallet.update_balance(100)
          payment_plan.update_plot_balance(100)
          user.wallet.settle_invoices(transaction: wallet_transaction)
        end

        it 'settles pending invoices' do
          expect(user.wallet.balance).to eql 0.0
          expect(invoice.land_parcel.payment_plan.reload.plot_balance).to eql 0.0
          expect(invoice.reload.pending_amount).to eql 0
          expect(invoice.reload.status).to eql 'paid'
          expect(payment_plan.reload.pending_balance).to eql 0
          expect(user.wallet_transactions.count).to eql 2
          expect(
            Payments::PaymentInvoice.where(wallet_transaction_id: wallet_transaction.id).count,
          ).to eql 1
        end
      end
    end
  end
end
