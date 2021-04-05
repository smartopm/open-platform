# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Invoice::InvoiceCancel do
  describe 'cancel for invoice' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 100)
    end
    let!(:invoice) do
      create(:invoice, community_id: user.community_id,
                       land_parcel_id: land_parcel.id,
                       user_id: user.id, status: 'in_progress',
                       amount: 200)
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
      expect(user.wallet.pending_balance).to eql 200.0
      expect(user.wallet_transactions.count).to eql 1
      expect(invoice.land_parcel.payment_plan.plot_balance).to eql 0.0
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'invoiceCancel', 'invoice', 'id')).not_to be_nil
      expect(
        result.dig('data', 'invoiceCancel', 'invoice', 'status'),
      ).to eql 'cancelled'
      expect(user.wallet.pending_balance).to eql 0.0
      expect(invoice.land_parcel.payment_plan.reload.plot_balance).to eql 100.0
      expect(user.wallet_transactions.count).to eql 2
      expect(result['errors']).to be_nil
    end
  end
end
