# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Transaction do
  describe 'Transaction queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_records',
                          role: admin_role,
                          permissions: %w[can_fetch_accounting_stats
                                          can_fetch_transaction_summary
                                          can_fetch_user_transactions])
    end
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:community) { user.community }
    let!(:land_parcel) do
      create(:land_parcel, community_id: community.id,
                           parcel_number: 'Plot01')
    end
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 1200, installment_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 500, receipt_number: '12345')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12345')
    end
    let!(:another_land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:another_payment_plan) do
      create(:payment_plan, land_parcel_id: another_land_parcel.id, user_id: user.id,
                            plot_balance: 0, pending_balance: 2400, installment_amount: 200)
    end
    let!(:another_transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1000, receipt_number: '12345')
    end
    let!(:another_plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: another_transaction.id,
                            payment_plan_id: another_payment_plan.id, amount: 1000,
                            manual_receipt_number: '54321')
    end
    let(:user_transactions_query) do
      <<~GQL
        query UserTransactions(
          $userId: ID!,
          $planId: ID
        ){
          userTransactions(
            userId: $userId,
            planId: $planId
          ){
            createdAt
            source
            amount
            unallocatedAmount
            depositor{
              name
            }
            planPayments {
              id
            }
          }
        }
      GQL
    end

    let(:payment_stat_query) do
      <<~GQL
        query PaymentStats{
          paymentAccountingStats {
            trxDate
            cash
            mobileMoney
            bankTransfer
            eft
            pos
          }
        }
      GQL
    end

    let(:transaction_summary_query) do
      <<~GQL
        query transactionSummary{
          transactionSummary{
            today
            oneWeek
            oneMonth
            overOneMonth
          }
        }
      GQL
    end

    describe '#user_transactions' do
      context 'when only user id is provided' do
        before do
          payment_plan.update_pending_balance(plan_payment.amount)
        end
        it "returns list of all user's transactions" do
          variables = { userId: user.id }
          result = DoubleGdpSchema.execute(user_transactions_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })

          expect(result.dig('data', 'userTransactions').size).to eql 2
          transaction_result = result.dig('data', 'userTransactions', 1)
          expect(transaction_result['amount']).to eql 500.0
          expect(transaction_result['unallocatedAmount']).to eql 0.0
          expect(transaction_result['depositor']['name']).to eql user.name
          expect(transaction_result['source']).to eql 'cash'
          other_transaction_result = result.dig('data', 'userTransactions', 0)
          expect(other_transaction_result['amount']).to eql 1000.0
          expect(other_transaction_result['unallocatedAmount']).to eql 0.0
          expect(other_transaction_result['depositor']['name']).to eql user.name
          expect(other_transaction_result['source']).to eql 'cash'
        end
      end

      context 'when plan id and user id both are provided' do
        context 'when plan id is invalid' do
          it 'raises payment plan not found error' do
            variables = { userId: user.id, planId: '12345' }
            result = DoubleGdpSchema.execute(user_transactions_query,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             })
            expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
          end
        end

        context 'when plan id is valid' do
          it 'returns transactions associated with the payment plan' do
            variables = { userId: user.id, planId: payment_plan.id }
            result = DoubleGdpSchema.execute(user_transactions_query,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: community,
                                             })
            expect(result.dig('data', 'userTransactions').size).to eql 1
            transaction_result = result.dig('data', 'userTransactions', 0)
            expect(transaction_result['amount']).to eql 500.0
            expect(transaction_result['unallocatedAmount']).to eql 0.0
            expect(transaction_result['depositor']['name']).to eql user.name
            expect(transaction_result['source']).to eql 'cash'
          end
        end
      end
    end

    describe '#payment_accounting_stats' do
      context 'when current user is not an admin' do
        it 'raises unauthorized error' do
          result = DoubleGdpSchema.execute(payment_stat_query,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end

      context 'when query is fetched' do
        it 'returns the transaction accounting stats' do
          result = DoubleGdpSchema.execute(payment_stat_query,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          payment_stats = result.dig('data', 'paymentAccountingStats', 0)
          expect(payment_stats['trxDate'].to_date).to eql(
            transaction.created_at.in_time_zone('Africa/Lusaka').to_date,
          )
          expect(payment_stats['cash']).to eql 1500
          expect(payment_stats['mobileMoney']).to eql 0
          expect(payment_stats['bankTransfer']).to eql 0
          expect(payment_stats['eft']).to eql 0
          expect(payment_stats['pos']).to eql 0
        end
      end
    end

    describe '#transaction_summary' do
      context 'when current user is not an admin' do
        it 'raises unauthorized error' do
          result = DoubleGdpSchema.execute(transaction_summary_query,
                                           context: {
                                             current_user: user,
                                             site_community: community,
                                           })
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end

      context 'when current user is an admin' do
        it 'returns transaction summary' do
          result = DoubleGdpSchema.execute(transaction_summary_query,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          transaction_summary_details = result.dig('data', 'transactionSummary')
          expect(transaction_summary_details['today']).to eql 1500.0
          expect(transaction_summary_details['oneWeek']).to eql 1500.0
          expect(transaction_summary_details['oneMonth']).to eql 1500.0
          expect(transaction_summary_details['overOneMonth']).to eql 1500.0
        end
      end
    end
  end
end
