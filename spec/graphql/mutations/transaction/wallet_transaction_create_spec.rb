# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Transaction::WalletTransactionCreate do
  describe 'create for transaction' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'transaction_plan',
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
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, duration: 2,
                            installment_amount: 100, plot_balance: 0)
    end
    let(:invoice) do
      create(:invoice, community_id: community.id, land_parcel: land_parcel, user_id: user.id,
                       status: 'in_progress', invoice_number: '1234', amount: 100,
                       payment_plan: payment_plan)
    end
    let(:mutation) do
      <<~GQL
        mutation walletTransactionCreate (
          $userId: ID!,
          $amount: Float!,
          $source: String!,
          $paymentPlanId: ID!
        ) {
          walletTransactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source,
            paymentPlanId: $paymentPlanId
          ){
            walletTransaction {
              id
              settledInvoices
              currentPendingPlotBalance
            }
          }
        }
      GQL
    end

    let(:past_payment_mutation) do
      <<~GQL
        mutation walletTransactionCreate (
          $userId: ID!,
          $amount: Float!,
          $source: String!,
          $paymentPlanId: ID!,
          $createdAt: String
        ) {
          walletTransactionCreate(
            userId: $userId,
            amount: $amount,
            source: $source,
            paymentPlanId: $paymentPlanId,
            createdAt: $createdAt
          ){
            walletTransaction {
              id
              settledInvoices
              currentPendingPlotBalance
              createdAt
            }
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when payment plan id is not valid' do
        it 'raises plan not found error' do
          variables = {
            userId: user.id,
            amount: 100,
            source: 'cash',
            paymentPlanId: '31222X',
          }
          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
          expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id'))
            .to be_nil
          expect(result.dig('errors', 0, 'message'))
            .to eql 'Payment Plan not found'
        end
      end

      context 'when payment plan is present' do
        before { payment_plan }

        context 'when source type is unallocated funds' do
          context 'when unallocated funds are less than transaction amount' do
            before { user.wallet.update(unallocated_funds: 50) }

            it 'raises funds not sufficient error' do
              variables = {
                userId: user.id,
                amount: 100,
                source: 'unallocated_funds',
                paymentPlanId: payment_plan.id,
              }
              result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: user.community,
                                                         }).as_json
              expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id'))
                .to be_nil
              expect(result.dig('errors', 0, 'message'))
                .to eql 'Unallocated funds are not sufficient for the payment'
            end
          end

          context 'when unallocated funds are greater than or equal to transaction amount' do
            before do
              user.wallet.update(unallocated_funds: 120, balance: 120)
              invoice
            end

            it 'creates transaction and settles pending invoices' do
              expect(invoice.pending_amount).to eql 100
              expect(user.wallet.pending_balance).to eql 100
              expect(user.wallet.balance).to eql 120
              expect(user.wallet.unallocated_funds).to eql 120
              expect(payment_plan.reload.pending_balance.to_f).to eql 300.0
              variables = {
                userId: user.id,
                amount: 100.0,
                source: 'unallocated_funds',
                paymentPlanId: payment_plan.id,
              }
              result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: user.community,
                                                         }).as_json
              expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id'))
                .not_to be_nil
              expect(result.dig('errors', 0, 'message')).to be_nil
              expect(invoice.reload.pending_amount).to eql 0
              expect(user.wallet.reload.pending_balance).to eql 0
              expect(user.wallet.balance).to eql 20
              expect(user.wallet.unallocated_funds.to_f).to eql 20.0
              expect(payment_plan.reload.pending_balance.to_f).to eql 200.0
            end
          end
        end

        context 'when source type is other than unallocated funds' do
          before do
            payment_plan
            invoice
          end

          it 'creates transaction and updates wallet balance' do
            expect(user.wallet.balance).to eql 0
            variables = {
              userId: user.id,
              amount: 50,
              source: 'cash',
              paymentPlanId: payment_plan.id,
            }
            result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                       context: {
                                                         current_user: admin,
                                                         site_community: user.community,
                                                       }).as_json
            invoices = result.dig(
              'data', 'walletTransactionCreate', 'walletTransaction', 'settledInvoices', 0
            )
            expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id'))
              .not_to be_nil
            expect(invoices['amount_owed']).to eql '100.0'
            expect(invoices['amount_paid']).to eql '50.0'
            expect(invoices['amount_remaining']).to eql '50.0'
            expect(
              result.dig(
                'data', 'walletTransactionCreate', 'walletTransaction',
                'currentPendingPlotBalance'
              ),
            ).to eql 250.0
            expect(result.dig('errors', 0, 'message')).to be_nil
            expect(user.wallet.balance).to eql 0
            expect(user.wallet.pending_balance).to eql 50
          end
        end
      end
    end

    context 'when payment is of past date' do
      before do
        payment_plan
        invoice
      end

      it 'creates transaction and updates wallet balance' do
        expect(user.wallet.balance).to eql 0
        variables = {
          userId: user.id,
          amount: 10,
          source: 'cash',
          paymentPlanId: payment_plan.id,
          createdAt: 10.days.ago.to_s,
        }
        DoubleGdpSchema.execute(past_payment_mutation, variables: variables,
                                                       context: {
                                                         current_user: admin,
                                                         site_community: user.community,
                                                       }).as_json
        past_date = 10.days.ago.to_date
        expect(user.wallet_transactions.count).to eql 2
        expect(user.wallet_transactions.pluck(:created_at).uniq.last.to_date).to eql past_date
        expect(user.payments.last.created_at.to_date).to eql past_date
      end
    end

    describe '#authorized?' do
      it 'throws unauthorized error when user is not admin' do
        variables = {
          userId: user.id,
          amount: 100,
          source: 'cash',
          paymentPlanId: payment_plan.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result.dig('data', 'walletTransactionCreate', 'walletTransaction', 'id')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
