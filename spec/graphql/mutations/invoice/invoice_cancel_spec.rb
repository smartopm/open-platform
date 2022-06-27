# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Invoice::InvoiceCancel do
  describe 'cancel for invoice' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_records',
                          role: admin_role,
                          permissions: %w[can_create_wallet_transaction])
    end
    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let(:community) { user.community }
    let!(:admin) do
      create(:admin_user, community_id: community.id, user_type: 'admin',
                          role: admin_role)
    end
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:user_wallet) { create(:wallet, user: user, balance: 100, unallocated_funds: 100) }
    let!(:payment_plan) do
      create(:payment_plan, duration: 2, installment_amount: 100, land_parcel_id: land_parcel.id,
                            user_id: user.id, plot_balance: 0)
    end
    let!(:invoice) do
      create(:invoice, community_id: community.id,
                       land_parcel_id: land_parcel.id,
                       payment_plan: payment_plan,
                       user_id: user.id, status: 'in_progress',
                       amount: 200)
    end
    let(:mutation) do
      <<~GQL
        mutation invoiceCancel($invoiceId: ID!,) {
          invoiceCancel(invoiceId: $invoiceId){
            invoice {
              id
              status
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when invoice is unpaid' do
        it 'cancels an invoice' do
          variables = { invoiceId: invoice.id }

          expect(user.wallet.pending_balance).to eql 200
          expect(payment_plan.reload.pending_balance.to_f).to eql 400.0
          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).to eql invoice.id
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'status')).to eql 'cancelled'
          expect(user.wallet.pending_balance).to be_zero
          expect(user.wallet.unallocated_funds).to eql 100
          expect(user.wallet.balance).to eql 100
          expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
          expect(user.wallet_transactions.count).to eql 1
          expect(result['errors']).to be_nil
        end
      end

      context 'when invoice is partially paid' do
        before do
          create_transaction(
            user: user, amount: 100, source: 'cash', payment_plan_id: payment_plan.id, admin: admin,
          )
        end

        it 'cancels an invoice and revert the paid amount to wallet' do
          variables = { invoiceId: invoice.id }

          expect(user.wallet.pending_balance.to_f).to eql 100.0
          expect(payment_plan.reload.pending_balance.to_f).to eql 300.0
          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).to eql invoice.id
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'status')).to eql 'cancelled'
          expect(user.wallet.pending_balance).to be_zero
          expect(user.wallet.unallocated_funds).to eql 200
          expect(user.wallet.balance).to eql 200
          expect(user.wallet.pending_balance).to be_zero
          expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
          expect(user.wallet_transactions.count).to eql 3
          expect(result['errors']).to be_nil
        end
      end

      context 'when invoice is paid' do
        before do
          create_transaction(
            user: user, amount: 200, source: 'cash', payment_plan_id: payment_plan.id, admin: admin,
          )
        end

        it 'cancels an invoice and revert the paid amount to wallet' do
          variables = { invoiceId: invoice.id }

          expect(user.wallet.pending_balance).to be_zero
          expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).to eql invoice.id
          expect(result.dig('data', 'invoiceCancel', 'invoice', 'status')).to eql 'cancelled'
          expect(user.wallet.pending_balance).to be_zero
          expect(user.wallet.unallocated_funds).to eql 300
          expect(user.wallet.balance).to eql 300
          expect(user.wallet.pending_balance).to be_zero
          expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
          expect(user.wallet_transactions.count).to eql 3
          expect(result['errors']).to be_nil
        end
      end
    end

    describe '#authorized?' do
      it 'throws unauthorized error when user is not admin' do
        variables = { invoiceId: invoice.id }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
