# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::PaymentPlanCreate do
  describe 'create for payment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_create_payment_plan])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:another_user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let(:payment_plan_mutation) do
      <<~GQL
        mutation paymentPlanCreate(
            $landParcelId: ID!
            $userId: ID!
            $coOwnersIds: [ID!]
            $startDate: String!
            $status: Int!
            $planType: String!
            $percentage: String
            $duration: Int!
            $installmentAmount: Float!
            $totalAmount: Float!
            $paymentDay: Int
            $frequency: Int!
            $renewable: Boolean!
        ) {
            paymentPlanCreate(
            landParcelId: $landParcelId
            userId: $userId
            coOwnersIds: $coOwnersIds
            startDate: $startDate
            status: $status
            planType: $planType
            percentage: $percentage
            duration: $duration
            installmentAmount: $installmentAmount
            totalAmount: $totalAmount
            paymentDay: $paymentDay
            frequency: $frequency
            renewable: $renewable
            ) {
            paymentPlan {
                id
                renewable
                coOwners{
                  name
                }
            }
          }
        }
      GQL
    end

    context 'when co owners are not selected' do
      it 'creates a payment plan for one landparcel' do
        variables = {
          landParcelId: land_parcel.id,
          userId: user.id,
          startDate: '2021-02-13',
          status: 1,
          planType: 'basic',
          percentage: '50%',
          duration: (rand * 10).ceil,
          installmentAmount: 1,
          totalAmount: 0,
          paymentDay: 2,
          frequency: 2,
          renewable: false,
        }
        result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: admin,
                                                                  site_community: user.community,
                                                                }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'paymentPlanCreate', 'paymentPlan', 'id')).not_to be_nil
        expect(result.dig('data', 'paymentPlanCreate', 'paymentPlan', 'renewable')).to eql false
      end
    end

    context 'when co owners are selected' do
      it 'creates a payment plan for one landparcel' do
        variables = {
          landParcelId: land_parcel.id,
          userId: user.id,
          coOwnersIds: [admin.id, another_user.id],
          startDate: '2021-02-13',
          status: 1,
          planType: 'basic',
          percentage: '50%',
          duration: (rand * 10).ceil,
          installmentAmount: 1,
          totalAmount: 0,
          paymentDay: 2,
          frequency: 2,
          renewable: true,
        }
        result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: admin,
                                                                  site_community: user.community,
                                                                }).as_json
        expect(result['errors']).to be_nil
        payment_plan_resut = result.dig('data', 'paymentPlanCreate', 'paymentPlan')
        expect(payment_plan_resut['id']).not_to be_nil
        expect(payment_plan_resut['coOwners'].size).to eql 2
      end
    end

    it 'should validate given variables inputs' do
      variables = {
        landParcelId: land_parcel.id,
        userId: user.id,
        startDate: '2021-02-13',
        status: 0,
        planType: 'basic',
        percentage: '50',
        duration: 0,
        installmentAmount: 0.0,
        totalAmount: 100.0,
        paymentDay: 31,
        frequency: 2,
        renewable: true,
      }
      result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: user.community,
                                                              }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to eql 'Payment day must be less than or equal to 28,Duration must be greater than or ' \
                  'equal to 1,Installment Amount must be greater than or equal to 1'
    end
  end
end
