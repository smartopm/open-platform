# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Payment do
  describe 'Payment plan queries' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: community.id) }
    let!(:non_admin) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
                            monthly_amount: 200)
    end
    let!(:transaction) do
      create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                           amount: 500)
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500)
    end
    let(:user_plans_with_payments) do
      <<~GQL
        query UserPlansWithPayments(
          $userId: ID!
        ){
          userPlansWithPayments(userId: $userId){
            planType
            pendingBalance
            monthlyAmount
            planPayments{
              amount
              userTransaction{
                source
              }
            }
          }
        }
      GQL
    end

    describe '#user_payment_plans' do
      context 'when current user is not an admin and user is not same as current user' do
        it 'raises unauthorized error' do
          variables = {
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(user_plans_with_payments,
                                           variables: variables,
                                           context: {
                                             current_user: non_admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
        end
      end

      context 'when user is admin' do
        before do
          payment_plan.pending_balance -= plan_payment.amount
          payment_plan.save
        end
        it "returns list of all user's payment plans" do
          variables = {
            userId: user.id,
          }
          result = DoubleGdpSchema.execute(user_plans_with_payments,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          payment_plans_result = result.dig('data', 'userPlansWithPayments', 0)
          plan_payment_result = payment_plans_result['planPayments'][0]
          expect(payment_plans_result['planType']).to eql 'lease'
          expect(payment_plans_result['monthlyAmount']).to eql 200.0
          expect(payment_plans_result['pendingBalance']).to eql 1900.0
          expect(plan_payment_result['amount']).to eql 500.0
          expect(plan_payment_result['userTransaction']['source']).to eql 'cash'
        end
      end
    end
  end
end
