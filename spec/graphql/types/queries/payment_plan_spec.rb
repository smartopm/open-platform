# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Payment do
  describe 'Payment plan queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_user_payment_plans can_fetch_plan_statement
                            can_fetch_community_payment_plans
                          ])
    end

    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:community) { user.community }
    let!(:non_admin) { create(:user, community_id: community.id, role: visitor_role) }
    let!(:land_parcel) do
      create(:land_parcel, community_id: community.id,
                           parcel_number: 'Plot001')
    end
    let(:another_payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: non_admin.id,
                            installment_amount: 300, status: 'completed')
    end
    let!(:plan_ownership) do
      another_payment_plan.plan_ownerships.create(user_id: user.id)
    end
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                            installment_amount: 100, start_date: Time.zone.today - 6.months)
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
    let!(:other_transaction) do
      create(:transaction, user_id: non_admin.id, community_id: community.id,
                           depositor_id: admin.id, amount: 700, receipt_number: '12301',
                           status: 'cancelled')
    end
    let!(:other_plan_payment) do
      create(:plan_payment, user_id: user.id, community_id: community.id,
                            transaction_id: other_transaction.id,
                            payment_plan_id: another_payment_plan.id,
                            amount: 700, manual_receipt_number: '12301', status: 'cancelled')
    end
    let(:other_payment_plan) do
      create(:payment_plan, user: user, land_parcel: land_parcel,
                            start_date: Time.zone.today)
    end
    let(:user_plans_with_payments) do
      <<~GQL
        query UserPlansWithPayments($userId: ID!) {
          userPlansWithPayments(userId: $userId) {
            planType
            pendingBalance
            installmentAmount
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
        query paymentPlanStatement($paymentPlanId: ID!) {
          paymentPlanStatement(paymentPlanId: $paymentPlanId) {
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

    let(:user_payment_plans) do
      <<~GQL
        query userPaymentPlans($userId: ID!) {
          userPaymentPlans(userId: $userId){
            startDate
            landParcel{
              parcelNumber
            }
          }
        }
      GQL
    end

    let(:community_payment_plans) do
      <<~GQL
        query communityPaymentPlans($query: String) {
          communityPaymentPlans(query: $query) {
            totalPayments
            expectedPayments
            owingAmount
            installmentsDue
            outstandingDays
            planStatus
          }
        }
      GQL
    end

    let(:user_general_plan) do
      <<~GQL
        query userGeneralPlan($userId: ID!) {
          userGeneralPlan(userId: $userId) {
            id
            status
            planPayments {
              id
              status
              amount
            }
          }
        }
      GQL
    end

    describe '#user_plans_with_payments' do
      context 'when current user is not an admin and user is not same as current user' do
        it 'raises unauthorized error' do
          variables = { userId: user.id }
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
          variables = { userId: user.id }
          result = DoubleGdpSchema.execute(user_plans_with_payments,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('data', 'userPlansWithPayments').size).to eql 2
        end
      end
    end

    context 'when user is not an admin' do
      before do
        another_payment_plan.pending_balance -= other_plan_payment.amount
        another_payment_plan.save
      end
      it "returns list of all user's payment plans with not cancelled payments" do
        variables = { userId: non_admin.id }
        result = DoubleGdpSchema.execute(user_plans_with_payments,
                                         variables: variables,
                                         context: {
                                           current_user: non_admin,
                                           site_community: community,
                                         })
        expect(result.dig('data', 'userPlansWithPayments').size).to eql 1
        payment_plans_result = result.dig('data', 'userPlansWithPayments', 0)
        plan_payment_result = payment_plans_result['planPayments'][0]
        expect(payment_plans_result['planType']).to eql 'basic'
        expect(payment_plans_result['installmentAmount']).to eql 300.0
        expect(payment_plans_result['pendingBalance']).to eql 2900.0
        expect(plan_payment_result['amount']).to eql 700.0
        expect(plan_payment_result['userTransaction']['source']).to eql 'cash'
      end
    end

    describe '#payment_plan_statement' do
      context 'when current is not an admin' do
        it 'raises unauthorized error' do
          variables = { paymentPlanId: payment_plan.id }
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
        context 'when payment plan is not present' do
          it 'raises payment plan not found error' do
            variables = { paymentPlanId: '1234' }
            result = DoubleGdpSchema.execute(
              payment_plan_statement,
              variables: variables,
              context: {
                current_user: admin,
                site_community: admin.community,
              },
            ).as_json
            expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
          end
        end

        context 'when payment plan is present' do
          context 'when payment amount is a multiple of monthly amount' do
            before { payment_plan.update(pending_balance: 1200 - 500) }

            it 'returns statements of payment plan' do
              variables = { paymentPlanId: payment_plan.id }
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
              variables = { paymentPlanId: payment_plan.id }
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

    describe '#user_payment_plans' do
      context 'when current user is not an admin' do
        it 'raises unauthorized error' do
          variables = { userId: user.id }
          result = DoubleGdpSchema.execute(user_plans_with_payments,
                                           variables: variables,
                                           context: {
                                             current_user: non_admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
        end
      end

      context 'when current user is admin' do
        it "returns list of user's active payment plans" do
          variables = { userId: user.id }
          result = DoubleGdpSchema.execute(user_payment_plans,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           })
          expect(result.dig('data', 'userPaymentPlans').size).to eql 1
          payment_plans_result = result.dig('data', 'userPaymentPlans', 0)
          expect(payment_plans_result['startDate'].to_date).to eql payment_plan.start_date.to_date
          expect(payment_plans_result['landParcel']['parcelNumber']).to eql 'Plot001'
        end
      end
    end

    describe '#community_payment_plans' do
      context 'when current user is admin' do
        before do
          payment_plan.update(pending_balance: 700)
          other_payment_plan
        end
        it "returns list of community's payment plans" do
          result = DoubleGdpSchema.execute(community_payment_plans,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'communityPaymentPlans').size).to eql 3
          payment_plan_result = result.dig('data', 'communityPaymentPlans', 0)
          expect(payment_plan_result['totalPayments']).to eql 500.0
          expect(payment_plan_result['expectedPayments']).to eql 600.0
          expect(payment_plan_result['owingAmount']).to eql 100.0
          expect(payment_plan_result['installmentsDue']).to eql 1
          expect(payment_plan_result['outstandingDays']).to eql payment_plan.outstanding_days
          expect(payment_plan_result['planStatus']).to eql 'behind'
        end

        it "returns list of community's payment plans based on filter" do
          variables = { query: 'owing_amount > 50.0' }
          result = DoubleGdpSchema.execute(community_payment_plans,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'communityPaymentPlans').size).to eql 1
          payment_plan_result = result.dig('data', 'communityPaymentPlans', 0)
          expect(payment_plan_result['owingAmount']).to eql 100.0
          expect(payment_plan_result['planStatus']).to eql 'behind'
        end

        it "returns list of community's payment plans based on filter" do
          variables = { query: 'plan_status : completed' }
          result = DoubleGdpSchema.execute(community_payment_plans,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'communityPaymentPlans').size).to eql 1
          payment_plan_result = result.dig('data', 'communityPaymentPlans', 0)
          expect(payment_plan_result['planStatus']).to eql 'completed'
        end

        it "returns list of community's payment plans based on filter" do
          variables = { query: 'plan_status : upcoming' }
          result = DoubleGdpSchema.execute(community_payment_plans,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'communityPaymentPlans').size).to eql 1
          payment_plan_result = result.dig('data', 'communityPaymentPlans', 0)
          expect(payment_plan_result['planStatus']).to eql 'on_track'
        end
      end

      context 'when current user is not an admin' do
        it 'raises unauthorized error' do
          result = DoubleGdpSchema.execute(community_payment_plans,
                                           context: {
                                             current_user: non_admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe '#user_general_plan' do
      context 'when user id is not valid' do
        it 'raises unauthorized error' do
          variables = { userId: '9364178cd' }
          result = DoubleGdpSchema.execute(user_general_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'User does not exists'
        end
      end

      context 'when user does not have a general plan' do
        it 'returns empty result' do
          variables = { userId: non_admin.id }
          result = DoubleGdpSchema.execute(user_general_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'userGeneralPlan')).to be_nil
        end
      end

      context 'when user has a general plan' do
        before { non_admin.general_payment_plan }

        it 'return the general plan for the user' do
          variables = { userId: non_admin.id }
          result = DoubleGdpSchema.execute(user_general_plan,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result.dig('data', 'userGeneralPlan', 'id')).to_not be_nil
          expect(result.dig('data', 'userGeneralPlan', 'status')).to eql 'general'
        end
      end
    end
  end
end
