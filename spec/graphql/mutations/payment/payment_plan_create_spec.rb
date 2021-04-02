# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Payment::PaymentPlanCreate do
  describe 'create for payment' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }

    let(:payment_plan_mutation) do
      <<~GQL
        mutation paymentPlan(
            $landParcelId: ID!
            $userId: ID!
            $startDate: String!
            $status: Int!
            $planType: String!
            $percentage: String!
            $durationInMonth: Int!
            $totalAmount: Float!
        ) {
            paymentPlanCreate(
            landParcelId: $landParcelId
            userId: $userId
            startDate: $startDate
            status: $status
            planType: $planType
            percentage: $percentage
            durationInMonth: $durationInMonth
            totalAmount: $totalAmount
            ) {
            paymentPlan {
                id
            }
        }
        }
      GQL
    end

    it 'creates a payment plan for one landparcel' do
      variables = {
        landParcelId: land_parcel.id,
        userId: user.id,
        startDate: '2021-02-13',
        status: 1,
        planType: 'lease',
        percentage: '50%',
        durationInMonth: (rand * 10).ceil,
        totalAmount: 0,
      }
      result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: user.community,
                                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'paymentPlanCreate', 'paymentPlan', 'id')).not_to be_nil

      # make sure there is no duplicate payment plan
      b_result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: admin,
                                                                  site_community: user.community,
                                                                }).as_json
      expect(b_result.dig('errors', 0, 'message'))
        .to eql 'Payment Plan for this landparcel already exist'
    end
    it 'should validate given variables inputs' do
      variables = {
        landParcelId: land_parcel.id,
        userId: user.id,
        startDate: '2021-02-13',
        status: '1',
        planType: 'lease',
        percentage: '50%',
        durationInMonth: (rand * 10).ceil,
        totalAmount: 100.0,
      }
      result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: user.community,
                                                              }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include 'Variable $status of type Int! was provided invalid value'
    end
  end
end
