# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::PaymentPlan::PaymentReminderCreate do
  describe 'create for payment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'payment_plan',
                          role: admin_role,
                          permissions: %w[can_send_payment_reminder])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:community) { user.community }
    let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
    let!(:payment_plan) { create(:payment_plan, user: user, land_parcel: land_parcel) }
    let(:payment_reminder_mutation) do
      <<~GQL
        mutation paymentReminderCreate(
          $paymentReminderFields: [PaymentReminderInput!]!
        ) {
            paymentReminderCreate(
              paymentReminderFields: $paymentReminderFields
            ) {
            message
          }
        }
      GQL
    end

    context 'when current user is an admin' do
      it 'sends payment reminder email to the users' do
        variables = {
          paymentReminderFields: [{
            userId: user.id,
            paymentPlanId: payment_plan.id,
          }],
        }
        result = DoubleGdpSchema.execute(payment_reminder_mutation, variables: variables,
                                                                    context: {
                                                                      current_user: admin,
                                                                      site_community: community,
                                                                    }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'paymentReminderCreate', 'message')).to eql 'Sucess'
      end
    end

    context 'when current user is not an admin' do
      it 'raises unauthorized error' do
        variables = {
          paymentReminderFields: [{
            userId: user.id,
            paymentPlanId: payment_plan.id,
          }],
        }
        result = DoubleGdpSchema.execute(payment_reminder_mutation, variables: variables,
                                                                    context: {
                                                                      current_user: user,
                                                                      site_community: community,
                                                                    }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
