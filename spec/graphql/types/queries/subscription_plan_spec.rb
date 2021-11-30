# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::SubscriptionPlan do
  describe 'SubscriptionPlan queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'subscription_plan',
                          role: admin_role,
                          permissions: %w[can_fetch_subscription_plans])
    end

    let!(:current_user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, role: admin_role) }
    let!(:subscription_plan) do
      create(:subscription_plan, community_id: current_user.community_id,
                                 amount: 500_000)
    end

    let(:subscription_plans_query) do
      <<~GQL
        {
            subscriptionPlans {
                id
                amount
            }
        }
      GQL
    end

    context 'when current user is not an admin' do
      it 'raises unauthorized error' do
        result = DoubleGdpSchema.execute(subscription_plans_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json

        expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      end
    end

    context 'when current user is an admin' do
      it 'should retrieve list of all subscription plans' do
        result = DoubleGdpSchema.execute(subscription_plans_query, context: {
                                           current_user: admin,
                                           site_community: current_user.community,
                                         }).as_json

        subscription_plans_result = result.dig('data', 'subscriptionPlans', 0)
        expect(subscription_plans_result).to_not be_nil
        expect(subscription_plans_result['id']).to eq subscription_plan.id
        expect(subscription_plans_result['amount']).to eq 500_000.0
      end
    end
  end
end
