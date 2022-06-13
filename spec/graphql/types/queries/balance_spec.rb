# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Balance do
  describe 'Balance queries' do
    let!(:user) { create(:user_with_community) }
    let!(:role) { user.role }
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, role: admin_role) }
    let!(:non_admin) { create(:user, community: community, role: admin_role) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            installment_amount: 100, duration: 10)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1500)
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 1000)
    end
    let(:user_balance_query) do
      <<~GQL
        query UserBalance(
          $userId: ID!
        ){
          userBalance(userId: $userId){
            balance
            pendingBalance
            totalTransactions
          }
        }
      GQL
    end

    describe '#user_balance' do
      context 'when current user is not an admin and user is not same as current user' do
        it 'raises unauthorized error' do
          variables = {
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(user_balance_query,
                                           variables: variables,
                                           context: {
                                             current_user: non_admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
        end
      end

      context 'when current_user is admin' do
        before :each do
          payment_plan.pending_balance -= plan_payment.amount
          payment_plan.save
        end

        context 'when the user have general plan' do
          before do
            user.general_payment_plan.plan_payments.create!(transaction_id: transaction.id,
                                                            community_id: community.id,
                                                            user_id: user.id, amount: 500.0,
                                                            status: 'paid')
          end

          it 'should retrieve balance and pending balance of user' do
            variables = {
              userId: user.id,
            }
            result = DoubleGdpSchema.execute(user_balance_query,
                                             variables: variables,
                                             context: {
                                               current_user: user,
                                               site_community: community,
                                             }).as_json
            query_result = result.dig('data', 'userBalance')
            expect(query_result['balance']).to eql 500.0
            expect(query_result['pendingBalance']).to eql 0.0
            expect(query_result['totalTransactions']).to eql 1500.0
          end
        end

        context 'when user does not have general plan' do
          it 'should display balance as 0' do
            variables = {
              userId: user.id,
            }
            expect(Properties::PaymentPlan.count).to eql 1
            result = DoubleGdpSchema.execute(user_balance_query,
                                             variables: variables,
                                             context: {
                                               current_user: user,
                                               site_community: community,
                                             }).as_json
            query_result = result.dig('data', 'userBalance')
            expect(query_result['balance']).to eql 0.0
            expect(query_result['pendingBalance']).to eql 0.0
            expect(query_result['totalTransactions']).to eql 1500.0
            expect(Properties::PaymentPlan.count).to eql 1
          end
        end
      end
    end
  end
end
