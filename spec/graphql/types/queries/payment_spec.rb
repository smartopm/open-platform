# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Payment do
  describe 'Payment queries' do
    let!(:user) { create(:user_with_community, user_type: 'admin') }
    let!(:another_user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice_one) do
      create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id,
                       status: 'in_progress')
    end
    let!(:payment_one) do
      user.payments.create(user_id: user.id, amount: 100, payment_type: 'cash',
                           invoice_id: invoice_one.id)
    end

    let!(:payment_two) do
      user.payments.create(user_id: user.id, amount: 200, payment_type: 'cash',
                           invoice_id: invoice_one.id)
    end

    let(:payments_query) do
      <<~GQL
        query {
            payments(userId: "#{user.id}") {
                id
                amount
              }
          }
      GQL
    end

    let(:payment_query) do
      <<~GQL
        query {
            payment(userId: "#{user.id}", paymentId: "#{payment_one.id}") {
                id
                amount
              }
          }
      GQL
    end

    # it 'should retrieve list of payments' do
    #   result = DoubleGdpSchema.execute(payments_query, context: {
    #                                      current_user: user,
    #                                      site_community: user.community,
    #                                    }).as_json
    #   expect(result.dig('errors', 0, 'message')).to be_nil
    #   expect(result.dig('data', 'payments').length).to eql 2
    #   expect([payment_one.id, payment_two.id]).to include(result.dig('data', 'payments', 0, 'id'))
    # end

    # it 'should not retrieve list of payments if user is not admin' do
    #   result = DoubleGdpSchema.execute(payments_query, context: {
    #                                      current_user: another_user,
    #                                      site_community: another_user.community,
    #                                    }).as_json
    #   expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    # end

    # it 'should retrieve payment by id' do
    #   result = DoubleGdpSchema.execute(payment_query, context: {
    #                                      current_user: user,
    #                                      site_community: user.community,
    #                                    }).as_json
    #   expect(result.dig('data', 'payment', 'id')).to eql payment_one.id
    #   expect(result.dig('data', 'payment', 'amount')).to eql 100.0
    #   expect(result.dig('errors', 0, 'message')).to be_nil
    # end
  end
end
