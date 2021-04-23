# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Payment::PaymentDayUpdate do
  describe '.resolve' do
    let(:user) { create(:user_with_community) }
    let(:admin) { create(:admin_user, community_id: user.community_id) }
    let(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let(:payment_plan) { create(:payment_plan, user: user, land_parcel: land_parcel) }

    let(:payment_day_mutation) do
      <<~GQL
        mutation paymentPlan(
          $id: ID!
          $userId: ID!
          $paymentDay: Int
        ) {
            paymentDayUpdate(
              id: $id
              userId: $userId
              paymentDay: $paymentDay
            )
            {
              paymentPlan {
                id
                paymentDay
              }
            }
          }
      GQL
    end

    let(:variables) do
      {
        id: payment_plan.id,
        userId: user.id,
        paymentDay: 2,
      }
    end

    let(:context) do
      {
        current_user: admin,
        site_community: user.community,
      }
    end

    context 'when user id is invalid' do
      before { variables[:userId] = '123123' }

      it 'should raise error user not found' do
        result = DoubleGdpSchema.execute(
          payment_day_mutation,
          variables: variables,
          context: context,
        ).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'Record not found'
      end
    end

    context 'when payment plan id invalid' do
      before { variables[:id] = '123123' }

      it 'should raise error plot balance not found' do
        result = DoubleGdpSchema.execute(
          payment_day_mutation,
          variables: variables,
          context: context,
        ).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'Record not found'
      end
    end

    context 'When the payment day is between 1-28' do
      it 'updates payment day of payment plan' do
        result = DoubleGdpSchema.execute(
          payment_day_mutation,
          variables: variables,
          context: context,
        ).as_json
        payment_plan_details = result.dig('data', 'paymentDayUpdate', 'paymentPlan')

        expect(result['errors']).to be_nil
        expect(payment_plan_details['id']).to eql payment_plan.id
        expect(payment_plan_details['paymentDay']).to eql 2
      end
    end

    context 'When the payment day is other than 1-28' do
      before { variables[:paymentDay] = 29 }

      it 'updates payment day of payment plan' do
        result = DoubleGdpSchema.execute(
          payment_day_mutation,
          variables: variables,
          context: context,
        ).as_json

        expect(result.dig('errors', 0, 'message'))
          .to eql 'Payment day must be less than or equal to 28'
      end
    end

    context 'When the payment day is not a number' do
      before { variables[:paymentDay] = nil }

      it 'updates payment day of payment plan' do
        result = DoubleGdpSchema.execute(
          payment_day_mutation,
          variables: variables,
          context: context,
        ).as_json

        expect(result.dig('errors', 0, 'message'))
          .to eql 'Payment day is not a number'
      end
    end
  end
end
