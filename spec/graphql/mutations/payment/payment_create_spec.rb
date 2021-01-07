# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Payment::PaymentCreate do
  describe 'create for payment' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice) do
      create(:invoice, land_parcel: land_parcel, community_id: user.community_id, user_id: user.id,
                       amount: 1000.to_f)
    end

    let(:mutation) do
      <<~GQL
        mutation paymentCreate (
          $invoiceId: ID!,
          $userId: ID!,
          $amount: Float!,
          $paymentType: String!
          $bankName: String!
          $chequeNumber: String!
        ) {
          paymentCreate(
            invoiceId: $invoiceId,
            userId: $userId,
            amount: $amount,
            paymentType: $paymentType
            bankName: $bankName
            chequeNumber: $chequeNumber
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
        bankName: 'Bank Name',
        chequeNumber: (rand * 10_000_000).floor.to_s,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'paymentCreate', 'payment', 'id')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should give error when payment amount is greater than invoice amount' do
      variables = {
        invoiceId: invoice.id,
        userId: user.id,
        amount: 10_000.to_f,
        paymentType: Payment::VALID_TYPES.sample,
        bankName: 'Bank Name',
        chequeNumber: (rand * 10_000_000).floor.to_s,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql
      'The amount you are trying to pay is higher than the invoiced amount'
    end
  end
end
