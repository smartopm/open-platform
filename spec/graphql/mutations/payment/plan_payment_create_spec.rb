# frozen_string_literal: true
# Note:- Plan Payment Create my is curently not in use, we will modify the code based on
#        future requirements.

# require 'rails_helper'

# RSpec.describe Types::Queries::Balance do
#   describe 'Balance queries' do
#     let!(:user) { create(:user_with_community) }
#     let!(:admin) { create(:admin_user) }
#     let!(:community) { user.community }
#     let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
#     let!(:payment_plan) do
#       create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0,
#                             monthly_amount: 100)
#     end
#     let!(:transaction) do
#       create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
#                            amount: 2000)
#     end
#     let!(:plan_payment) do
#       create(:plan_payment, user_id: user.id, community_id: community.id,
#                             transaction_id: transaction.id, payment_plan_id: payment_plan.id,
#                             amount: 1200)
#     end
#     let!(:other_land_parcel) { create(:land_parcel, community_id: community.id) }
#     let!(:other_payment_plan) do
#       create(:payment_plan, land_parcel_id: other_land_parcel.id, user_id: user.id,
#                     plot_balance: 0, monthly_amount: 200)
#     end
#     let(:payment_create_mutation) do
#       <<~GQL
#         mutation PlanPaymentCreate(
#           $userId: ID!,
#           $landParcelId: ID!,
#           $transactionId: ID!,
#           $amount: Float!
#         ){
#           planPaymentCreate(
#             userId: $userId,
#             landParcelId: $landParcelId,
#             transactionId: $transactionId,
#             amount: $amount
#           ){
#             payment{
#               userTransaction{
#                 unallocatedAmount
#               }
#               paymentPlan{
#                 pendingBalance
#               }
#             }
#           }
#         }
#       GQL
#     end

# describe '#authorized?' do
#   context 'when current user is not admin' do
#     it 'raises unauthorized error' do
#       variables = {
#         userId: user.id,
#         landParcelId: land_parcel.id,
#         transactionId: transaction.id,
#         amount: 200,
#       }
#       result = DoubleGdpSchema.execute(payment_create_mutation,
#                                        variables: variables,
#                                        context: {
#                                          current_user: user,
#                                          site_community: community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
#     end
#   end
# end

# describe '#resolve' do
#   before { payment_plan.update(pending_balance: 0) }
#   context 'when amount is greater than unallocated amount' do
#     it 'raises not sufficient unallocated amount error' do
#       variables = {
#         userId: user.id,
#         landParcelId: other_land_parcel.id,
#         transactionId: transaction.id,
#         amount: 1000,
#       }
#       result = DoubleGdpSchema.execute(payment_create_mutation,
#                                        variables: variables,
#                                        context: {
#                                          current_user: admin,
#                                          site_community: community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message'))
#         .to eql 'Unallocated amount is not sufficient for the payment'
#     end
#   end

#   context 'when amount is less than or equal to unallocated amount' do
#     it 'creates plan payment and updates plan pending balance' do
#       variables = {
#         userId: user.id,
#         landParcelId: other_land_parcel.id,
#         transactionId: transaction.id,
#         amount: 200,
#       }
#       result = DoubleGdpSchema.execute(payment_create_mutation,
#                                        variables: variables,
#                                        context: {
#                                          current_user: admin,
#                                          site_community: community,
#                                        }).as_json
#       payment_details = result.dig('data', 'planPaymentCreate', 'payment')
#       expect(payment_details['userTransaction']['unallocatedAmount']).to eql 600.0
#       expect(payment_details['paymentPlan']['pendingBalance']).to eql 2200.0
#     end
#   end
# end
# end
# end
