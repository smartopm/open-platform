# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::Wallet, type: :model do
  let!(:user) { create(:user_with_community) }
  let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
  end
  let(:invoice) do
    create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id,
                     status: 'in_progress', invoice_number: '1234', amount: 100)
  end
  let(:txn) do
    create(:wallet_transaction, amount: 100, destination: 'wallet',
                                user: user, community_id: user.community_id,
                                payment_plan_id: payment_plan.id)
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:pending_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:currency).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
  end

  describe 'methods' do
    it 'should add balance to the wallet' do
      expect(user.wallet.balance).to eql 0.0
      user.wallet.update_balance(100)
      expect(user.wallet.balance).to eql 100.0
    end

    it 'should debit amount from balance' do
      user.wallet.update_balance(100, 'debit')
      expect(user.wallet.balance).to eql 0.0
      expect(user.wallet.pending_balance).to eql 100.0
    end

    it 'should settle invoice if pending when amount is added' do
      invoice
      expect(user.wallet.pending_balance).to eql invoice.amount
      user.payment_plans.update(plot_balance: invoice.amount)
      user.wallet.update_balance(invoice.amount)
      user.wallet.settle_invoices(txn.id)
      expect(user.wallet.balance).to eql 0.0
      expect(invoice.land_parcel.payment_plan.reload.plot_balance).to eql 0.0
      expect(invoice.reload.status).to eql 'paid'
    end
  end
end
