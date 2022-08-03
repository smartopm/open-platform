# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::WalletTransaction, type: :model do
  let!(:admin_role) { create(:role, name: 'admin') }
  let!(:resident_role) { create(:role, name: 'resident') }
  let!(:permission) do
    create(:permission, module: 'payment_records',
                        role: admin_role,
                        permissions: %w[can_create_wallet_transaction])
  end
  let!(:user) do
    create(:user_with_community, user_type: 'resident',
                                 role: resident_role)
  end
  let(:community) { user.community }
  let!(:admin) do
    create(:admin_user, community_id: community.id, user_type: 'admin',
                        role: admin_role)
  end
  let(:community) { user.community }
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, duration: 2, installment_amount: 100, land_parcel_id: land_parcel.id,
                          user_id: user.id, plot_balance: 0)
  end
  let!(:invoice) do
    create(:invoice, community_id: community.id,
                     land_parcel_id: land_parcel.id,
                     payment_plan_id: payment_plan.id,
                     user_id: user.id, status: 'in_progress',
                     amount: 100)
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:payment_plan_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:depositor_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:current_wallet_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:destination).of_type(:string) }
    it { is_expected.to have_db_column(:bank_name).of_type(:string) }
    it { is_expected.to have_db_column(:cheque_number).of_type(:string) }
    it { is_expected.to have_db_column(:settled_invoices).of_type(:json) }
    it { is_expected.to have_db_column(:current_pending_plot_balance).of_type(:decimal) }
  end

  describe 'validations' do
    it do
      is_expected.to validate_inclusion_of(:source)
        .in_array(Payments::WalletTransaction::VALID_SOURCES)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:payment_plan).optional }
    it { is_expected.to belong_to(:depositor).optional }
    it { is_expected.to have_one(:payment_invoice) }
  end

  describe 'callbacks' do
    it { is_expected.to callback(:revert_payments).after(:update) }
    it { is_expected.to callback(:update_wallet_balance).before(:update) }

    describe 'after_update' do
      describe '#revert_payments' do
        context 'when wallet balance is more than transaction amount' do
          before do
            create_transaction(
              user: user, amount: 120, source: 'cash', payment_plan_id: payment_plan.id,
              admin: admin
            )
            create_transaction(
              user: user, amount: 130, source: 'cash', payment_plan_id: payment_plan.id,
              admin: admin
            )
          end

          it 'reverts payment and update wallet balance' do
            expect(user.wallet.balance).to eql 150
            expect(user.wallet.unallocated_funds).to eql 150
            expect(user.wallet.pending_balance).to eql 0
            expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
            expect(invoice.reload.pending_amount).to eql 0
            expect(invoice.status).to eql 'paid'
            Payments::WalletTransaction.find_by(amount: 120, source: 'cash').cancelled!
            expect(user.wallet.balance).to eql 30
            expect(user.wallet.unallocated_funds).to eql 30
            expect(user.wallet.pending_balance).to eql 0
            expect(invoice.reload.pending_amount).to eql 0
            expect(invoice.status).to eql 'paid'
            expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
            expect(invoice.payments.count).to eql 1
            expect(invoice.payments.pluck(:payment_status)).to include('settled')
          end
        end

        context 'when wallet balance is equal to transaction amount' do
          before do
            create_transaction(
              user: user, amount: 100, source: 'cash', payment_plan_id: payment_plan.id,
              admin: admin
            )
          end

          it 'reverts payment and associated paid invoices and update wallet balance' do
            expect(user.wallet.balance).to eql 0
            expect(user.wallet.pending_balance).to eql 0
            expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
            expect(invoice.reload.pending_amount).to eql 0
            expect(invoice.status).to eql 'paid'
            Payments::WalletTransaction.find_by(amount: 100, source: 'cash').cancelled!
            expect(user.wallet.balance).to eql 0
            expect(user.wallet.pending_balance).to eql 100
            expect(invoice.reload.pending_amount).to eql 100
            expect(invoice.status).to eql 'in_progress'
            expect(payment_plan.reload.pending_balance.to_f).to eql 300.0
            expect(invoice.payments.count).to eql 1
            expect(invoice.payments.pluck(:payment_status)).to include('cancelled')
          end
        end

        context 'when wallet balance is less than transaction amount' do
          before do
            create_transaction(
              user: user, amount: 50, source: 'cash', payment_plan_id: payment_plan.id,
              admin: admin
            )
            create_transaction(
              user: user, amount: 30, source: 'cash', payment_plan_id: payment_plan.id,
              admin: admin
            )
          end

          it 'reverts payment and associated paid invoices and update wallet balance' do
            expect(user.wallet.balance).to eql 0
            expect(user.wallet.pending_balance).to eql 20
            expect(payment_plan.reload.pending_balance.to_f).to eql 220.0
            expect(invoice.reload.pending_amount).to eql 20
            expect(invoice.status).to eql 'in_progress'
            Payments::WalletTransaction.find_by(amount: 50, source: 'cash').cancelled!
            expect(user.wallet.balance).to eql 0
            expect(user.wallet.pending_balance).to eql 70
            expect(invoice.reload.pending_amount).to eql 70
            expect(invoice.status).to eql 'in_progress'
            expect(payment_plan.reload.pending_balance.to_f).to eql 270.0
            expect(invoice.payments.count).to eql 3
            expect(invoice.payments.pluck(:payment_status))
              .to include('settled', 'cancelled', 'cancelled')
          end
        end
      end
    end
  end
end
