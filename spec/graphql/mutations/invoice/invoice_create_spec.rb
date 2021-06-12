# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Invoice::InvoiceCreate do
  describe 'create for invoice' do
    let!(:user) { create(:user_with_community) }
    let!(:user_with_balance) { create(:user, community_id: user.community_id) }
    let!(:user_wallet) { create(:wallet, user: user_with_balance, balance: 100) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:payment_plan) do
      create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
    end

    let(:query) do
      <<~GQL
        mutation invoiceCreate($landParcelId: ID!, $amount: Float!, $dueDate: String!, $status: String!, $userId: ID!) {
          invoiceCreate(landParcelId: $landParcelId, amount: $amount, dueDate: $dueDate, status: $status, userId: $userId){
            invoice {
              id
              amount
              landParcel {
                id
              }
            }
          }
        }
      GQL
    end

    it 'creates an invoice associated to land parcel and updates pending_balance of wallet' do
      variables = {
        userId: user.id,
        landParcelId: land_parcel.id,
        amount: (rand * 100).to_f,
        dueDate: (rand * 10).to_i.day.from_now.to_s,
        status: %w[in_progress late paid cancelled].sample,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      invoice_id = result.dig('data', 'invoiceCreate', 'invoice', 'id')
      invoice = Payments::Invoice.find invoice_id
      expect(invoice_id).not_to be_nil
      expect(
        result.dig('data', 'invoiceCreate', 'invoice', 'landParcel', 'id'),
      ).to eql land_parcel.id
      expect(
        result.dig('data', 'invoiceCreate', 'invoice', 'amount'),
      ).to eql user.wallet.pending_balance.to_f
      expect(user.wallet.pending_balance).to eql invoice.amount
      expect(payment_plan.reload.pending_balance).to eql invoice.amount
      expect(result['errors']).to be_nil
    end
  end
end
