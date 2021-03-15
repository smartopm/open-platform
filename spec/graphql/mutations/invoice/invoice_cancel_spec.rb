# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Invoice::InvoiceCancel do
  describe 'cancel for invoice' do
    let!(:user) { create(:user_with_community) }
    let!(:user_with_balance) { create(:user, community_id: user.community_id) }
    let!(:user_wallet) { create(:wallet, user: user_with_balance, balance: 100) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice) do
      create(:invoice, community_id: user.community_id,
                       land_parcel_id: land_parcel.id,
                       user_id: user.id, status: 'in_progress')
    end

    let(:query) do
      <<~GQL
        mutation invoiceCancel($invoiceId: ID!,) {
          invoiceCancel(invoiceId: $invoiceId){
            invoice {
              id
              status
            }
          }
        }
      GQL
    end

    it 'cancels an invoice' do
      variables = {
        invoiceId: invoice.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).not_to be_nil
      expect(
        result.dig('data', 'invoiceCancel', 'invoice', 'status'),
      ).to eql 'cancelled'
      expect(result['errors']).to be_nil
    end
  end
end
