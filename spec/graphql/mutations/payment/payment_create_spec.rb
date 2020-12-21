# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Payment::PaymentCreate do
  describe 'create for payment' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice) do
      create(:invoice, land_parcel: land_parcel, community_id: user.community_id, user_id: user.id)
    end

    let(:mutation) do
      <<~GQL
        mutation paymentCreate (
          $invoiceId: ID!,
          $userId: ID!,
          $amount: Float!,
          $paymentType: String!
        ) {
          paymentCreate(
            invoiceId: $invoiceId,
            userId: $userId,
            amount: $amount,
            paymentType: $paymentType
          ){
            payment {
              id
            }
          }
        }
      GQL
    end

    it 'creates a payment record associated to invoice' do
      variables = {
        invoiceId: invoice.id,
        userId: user.id,
        amount: (rand * 100).to_f,
        paymentType: Payment::VALID_TYPES.sample,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'paymentCreate', 'payment', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end
  end
end
