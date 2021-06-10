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
                           amount: 500, receipt_number: '12300')
    end
    let!(:plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                            amount: 500, manual_receipt_number: '12300')
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
              planValue
              statementPaidAmount
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
              receiptNumber
              paymentDate
              amountPaid
              installmentAmount
              settledInstallments
              debitAmount
              unallocatedAmount
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
          expect(payment_plans_result['monthlyAmount']).to eql 100.0
          expect(payment_plans_result['pendingBalance']).to eql 700.0
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
            },
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
              },
            ).as_json
            expect(result.dig('errors', 0, 'message')).to eql 'Land parcel not found'
          end
        end

        context 'when land parcel is present' do
          context 'when payment amount is a multiple of monthly amount' do
            before { payment_plan.update(pending_balance: 1200 - 500) }

            it 'returns statements of payment plan' do
              variables = { landParcelId: land_parcel.id }
              result = DoubleGdpSchema.execute(
                payment_plan_statement,
                variables: variables,
                context: {
                  current_user: admin,
                  site_community: admin.community,
                },
              ).as_json
              payment_plan = result.dig('data', 'paymentPlanStatement', 'paymentPlan')
              statement = result.dig('data', 'paymentPlanStatement', 'statements', 0)
              expect(payment_plan['statementPaidAmount']).to eql 500.0
              expect(payment_plan['pendingBalance']).to eql 700.0
              expect(payment_plan['planValue']).to eql 1200.0
              expect(payment_plan['user']['name']).to eql 'Mark Test'
              expect(statement['receiptNumber']).to eql 'MI12300'
              expect(statement['paymentDate'].to_date).to eql plan_payment.created_at.to_date
              expect(statement['amountPaid']).to eql 500.0
              expect(statement['installmentAmount']).to eql 100.0
              expect(statement['settledInstallments']).to eql 5
              expect(statement['debitAmount']).to eql 500.0
              expect(statement['unallocatedAmount']).to eql 0.0
            end
          end

          context 'when payment amount is not a multiple of monthly amount' do
            before do
              transaction.update(amount: 450)
              plan_payment.update(amount: 450)
              payment_plan.update(pending_balance: 1200 - 450)
            end

            it 'returns statements of payment plan' do
              variables = { landParcelId: land_parcel.id }
              result = DoubleGdpSchema.execute(
                payment_plan_statement,
                variables: variables,
                context: {
                  current_user: admin,
                  site_community: admin.community,
                },
              ).as_json
              payment_plan = result.dig('data', 'paymentPlanStatement', 'paymentPlan')
              statement = result.dig('data', 'paymentPlanStatement', 'statements', 0)
              expect(payment_plan['statementPaidAmount']).to eql 400.0
              expect(payment_plan['pendingBalance']).to eql 750.0
              expect(payment_plan['planValue']).to eql 1200.0
              expect(payment_plan['user']['name']).to eql 'Mark Test'
              expect(statement['receiptNumber']).to eql 'MI12300'
              expect(statement['paymentDate'].to_date).to eql plan_payment.created_at.to_date
              expect(statement['amountPaid']).to eql 450.0
              expect(statement['installmentAmount']).to eql 100.0
              expect(statement['settledInstallments']).to eql 4
              expect(statement['debitAmount']).to eql 400.0
              expect(statement['unallocatedAmount']).to eql 50.0
            end
          end
        end
      end
    end
  end
end
