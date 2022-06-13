# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::SubscriptionPlan::SubscriptionPlanCreate do
  describe 'create  a subscription plan' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'subscription_plan',
                          role: admin_role,
                          permissions: %w[can_create_subscription_plan])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let(:sub_plan_mutation) do
      <<~GQL
        mutation SubscriptionPlanCreate(
          $amount: Float!
          $planType: String!
          $startDate: String!
          $endDate: String!
          $status: String
        ) {
          subscriptionPlanCreate(
            amount: $amount
            planType: $planType
            startDate: $startDate
            endDate: $endDate
            status: $status
            ) {
            success
          }
        }
      GQL
    end

    context 'when current user is an admin' do
      it 'creates a subscription plan' do
        previous_count = Payments::SubscriptionPlan.count
        variables = {
          amount: 500,
          planType: 'standard',
          startDate: '2021-02-13',
          endDate: '2022-02-13',
          status: 'active',
        }
        result = DoubleGdpSchema.execute(sub_plan_mutation, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: user.community,
                                                            }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'subscriptionPlanCreate', 'success')).to eq(true)
        expect(Payments::SubscriptionPlan.count).to eq(previous_count + 1)
      end
    end

    context 'when current user is not an admin' do
      it 'raises an error' do
        variables = {
          amount: 500,
          planType: 'standard',
          startDate: '2021-02-13',
          endDate: '2022-02-13',
          status: 'active',
        }
        result = DoubleGdpSchema.execute(sub_plan_mutation, variables: variables,
                                                            context: {
                                                              current_user: user,
                                                              site_community: user.community,
                                                            }).as_json
        expect(result['errors']).not_to be_nil
        expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      end
    end
  end
end
