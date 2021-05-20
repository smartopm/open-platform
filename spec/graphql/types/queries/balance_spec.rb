# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Balance do
  describe 'Balance queries' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user) }
    let!(:non_admin) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 2000)
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
        before do
          payment_plan.pending_balance -= plan_payment.amount
          payment_plan.save
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
          expect(query_result['pendingBalance']).to eql 1000.0
        end
      end
    end
  end
end
