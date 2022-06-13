# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::SubscriptionPlan::SubscriptionPlanUpdate do
  describe 'update a subscription plan' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'subscription_plan',
                          role: admin_role,
                          permissions: %w[can_update_subscription_plan])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let(:subscription_plan) { create(:subscription_plan, community_id: user.community_id) }

    let(:sub_plan_update_mutation) do
      <<~GQL
        mutation SubscriptionPlanUpdate(
          $amount: Float!
          $planType: String!
          $startDate: String!
          $endDate: String!
          $status: String
          $id: ID!
        ) {
          subscriptionPlanUpdate(
            amount: $amount
            planType: $planType
            startDate: $startDate
            endDate: $endDate
            status: $status
            id: $id
            ) {
            success
          }
        }
      GQL
    end

    context 'when current user is an admin' do
      it 'updates a subscription plan' do
        variables = {
          amount: 500,
          planType: 'standard',
          startDate: '2021-02-13',
          endDate: '2022-02-14',
          status: 'active',
          id: subscription_plan.id,
        }
        result = DoubleGdpSchema.execute(sub_plan_update_mutation, variables: variables,
                                                                   context: {
                                                                     current_user: admin,
                                                                     site_community: user.community,
                                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'subscriptionPlanUpdate', 'success')).to eq(true)
      end
    end

    context 'when creating with an invalid ID' do
      it 'raises an error' do
        variables = {
          amount: 500,
          planType: 'standard',
          startDate: '2021-02-13',
          endDate: '2022-02-13',
          status: 'active',
          id: 'h43uyy45te7i3u4',
        }
        result = DoubleGdpSchema.execute(sub_plan_update_mutation, variables: variables,
                                                                   context: {
                                                                     current_user: admin,
                                                                     site_community: user.community,
                                                                   }).as_json
        expect(result['errors']).not_to be_nil
        expect(result.dig('errors', 0, 'message')).to include 'Plan subscription not found'
      end
    end
  end
end
