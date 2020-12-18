# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Invoice::InvoiceCreate do
  describe 'create for invoice' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation invoiceCreate($landParcelId: ID!, $amount: String!, $dueDate: String!, $status: String!, $userId: ID!) {
          invoiceCreate(landParcelId: $landParcelId, amount: $amount, dueDate: $dueDate, status: $status, userId: $userId){
            invoice {
              id
              landParcel {
                id
              }
            }
          }
        }
      GQL
    end

    it 'creates a an invoice associated to land parcel' do
      variables = {
        userId: user.id,
        landParcelId: land_parcel.id,
        amount: (rand * 100).to_s,
        dueDate: (rand * 10).to_i.day.from_now.to_s,
        status: %w[in_progress late paid cancelled].sample,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'invoiceCreate', 'invoice', 'id')).not_to be_nil
      expect(
        result.dig('data', 'invoiceCreate', 'invoice', 'landParcel', 'id'),
      ).to eql land_parcel.id
      expect(result.dig('errors')).to be_nil
    end
  end
end
