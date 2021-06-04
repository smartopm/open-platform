# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Transaction do
  describe 'Transaction queries' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            pending_balance: 1200, monthly_amount: 100)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 1500, receipt_number: '12345')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12345')
    end
    let(:user_transactions_query) do
      <<~GQL
        query UserTransactions(
          $userId: ID!
        ){
          userTransactions(userId: $userId){
            createdAt
            source
            amount
            unallocatedAmount
            depositor{
              name
            }
          }
        }
      GQL
    end

    describe '#user_transactions' do
      context 'when user id is provided' do
        before do
          payment_plan.update_pending_balance(plan_payment.amount)
        end
        it "returns list of all user's transactions" do
          variables = {
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(user_transactions_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })

          transaction_result = result.dig('data', 'userTransactions', 0)
          expect(transaction_result['amount']).to eql 1500.0
          expect(transaction_result['unallocatedAmount']).to eql 1000.0
          expect(transaction_result['depositor']['name']).to eql user.name
          expect(transaction_result['source']).to eql 'cash'
        end
      end
    end
  end
end
