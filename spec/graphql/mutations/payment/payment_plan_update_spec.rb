# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::PaymentPlanUpdate do
  describe 'create for payment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_update_payment_plan])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) { create(:payment_plan, land_parcel: land_parcel, user: user) }
    let(:payment_plan_mutation) do
      <<~GQL
        mutation paymentPlanUpdate(
            $planId: ID!
            $renewable: Boolean
            $paymentDay: Int
        ) {
          paymentPlanUpdate(
            planId: $planId
            renewable: $renewable
            paymentDay: $paymentDay
          ) {
            paymentPlan {
              paymentDay
              renewable
            }
          }
        }
      GQL
    end

    context 'when payment plan id is valid' do
      it 'updates the payment plan' do
        variables = {
          planId: payment_plan.id,
          paymentDay: 3,
          renewable: true,
        }
        result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: admin,
                                                                  site_community: community,
                                                                }).as_json
        expect(result['errors']).to be_nil
        plan_result = result.dig('data', 'paymentPlanUpdate', 'paymentPlan')
        expect(plan_result['paymentDay']).to eql 3
        expect(plan_result['renewable']).to eql true
      end
    end

    context 'when payment plan id is not valid' do
      it 'raises payment plan not found error' do
        variables = {
          planId: 'zzzyyy333',
          paymentDay: 3,
          renewable: true,
        }
        result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: admin,
                                                                  site_community: community,
                                                                }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Payment Plan not found'
      end
    end

    context 'when current user is not an admin' do
      it 'raises unauthorized error' do
        variables = {
          planId: payment_plan.id,
          paymentDay: 3,
          renewable: true,
        }
        result = DoubleGdpSchema.execute(payment_plan_mutation, variables: variables,
                                                                context: {
                                                                  current_user: user,
                                                                  site_community: community,
                                                                }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
