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
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            monthly_amount: 100)
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

    let(:payment_plan_statement) do
      <<~GQL
        query paymentPlanStatement($landParcelId: ID!) {
          paymentPlanStatement(landParcelId: $landParcelId) {
            paymentPlan {
              id
              startDate
              pendingBalance
              user {
                name
                phoneNumber
              }
              landParcel {
                community {
                  name
                }
              }
            }
            statements {
              transactionNumber
              paymentDate
              dueDate
              amountPaid
              balance
              status
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

    describe '#payment_plan_statement' do
      context 'when current is not an admin' do
        it 'raises unauthorized error' do
          variables = { landParcelId: land_parcel.id }
          result = DoubleGdpSchema.execute(
                                            payment_plan_statement,
                                            variables: variables,
                                            context: {
                                              current_user: non_admin,
                                              site_community: non_admin.community,
                                            }
                                          ).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end

      context 'when current user is an admin' do

        context 'when land parcel is not present' do
          it 'raises land parcel not found error' do
            variables = { landParcelId: '1234' }
            result = DoubleGdpSchema.execute(
                                              payment_plan_statement,
                                              variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }
                                            ).as_json
            expect(result.dig('errors', 0, 'message')).to eql 'Land parcel not found'
          end
        end

        context 'when land parcel is present' do

          context 'when partial payment is allocated to monthly installments' do
            before do
              create_list(
                :plan_payment,
                2,
                amount: 200,
                transaction_id: user_transaction.id,
                user_id: non_admin.id,
                payment_plan_id: payment_plan.id,
                community: admin.community
              )
              payment_plan.update(pending_balance: 1200 - 400)
            end

            it 'returns statements of payment plan' do
              variables = { landParcelId: land_parcel.id }
              result = DoubleGdpSchema.execute(
                                                payment_plan_statement,
                                                variables: variables,
                                                context: {
                                                  current_user: admin,
                                                  site_community: admin.community,
                                                }
                                              ).as_json
              payment_plan = result.dig('data', 'paymentPlanStatement', 'paymentPlan')
              statements = result.dig('data', 'paymentPlanStatement', 'statements')
              details = statements.map { |statement| statement.slice('amountPaid', 'balance', 'status') }
              expect(payment_plan['pendingBalance']).to eql 800.0
              expect(payment_plan['user']['name']).to eql 'Mark Test'
              expect(details).to include(
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
              )
            end
          end

          context 'when full payment is allocated to monthly installments' do
            before do
              create_list(
                :plan_payment,
                2,
                amount: 210,
                transaction_id: user_transaction.id,
                user_id: non_admin.id,
                payment_plan_id: payment_plan.id,
                community: admin.community
              )
              payment_plan.update(pending_balance: 1200 - 420)
            end

            it 'returns statements of payment plan' do
              variables = { landParcelId: land_parcel.id }
              result = DoubleGdpSchema.execute(
                                                payment_plan_statement,
                                                variables: variables,
                                                context: {
                                                  current_user: admin,
                                                  site_community: admin.community,
                                                }
                                              ).as_json
              payment_plan = result.dig('data', 'paymentPlanStatement', 'paymentPlan')
              statements = result.dig('data', 'paymentPlanStatement', 'statements')
              details = statements.map { |statement| statement.slice('amountPaid', 'balance', 'status') }
              expect(payment_plan['pendingBalance']).to eql 780.0
              expect(payment_plan['user']['name']).to eql 'Mark Test'
              expect(details).to include(
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 100.0, 'balance' => 0, 'status' => 'paid' },
                { 'amountPaid' => 20, 'balance' => 80.0, 'status' => 'paid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
                { 'amountPaid' => 0, 'balance' => 100.0, 'status' => 'unpaid' },
              )
            end
          end
        end
      end
    end
  end
end
