# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::PaymentPlan do

  describe '#payment_plan_statement' do
    let!(:admin) { create(:user_with_community, user_type: 'admin') }
    let(:non_admin) { create(:user, user_type: 'client', community: admin.community) }
    let!(:land_parcel) { create(:land_parcel, community_id: admin.community_id) }
    let!(:payment_plan) do
      create(
        :payment_plan,
        land_parcel_id: land_parcel.id,
        user_id: non_admin.id,
        monthly_amount: 100,
        pending_balance: 1200
      )
    end
    let!(:user_transaction) do
      create(
        :transaction,
        user_id: non_admin.id,
        amount: 450,
        community_id: non_admin.community_id,
      )
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