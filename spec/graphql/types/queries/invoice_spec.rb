# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Invoice do
  describe 'Invoice queries' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice_one) do
      create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id)
    end
    let!(:invoice_two) do
      create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id)
    end

    let(:invoices_query) do
      <<~GQL
        query {
          invoices {
              id
              landParcel {
                id
              }
            }
          }
      GQL
    end

    let(:invoice_query) do
      <<~GQL
        query invoice (
          $id: ID!
        ) {
          invoice(id: $id) {
              id
            }
          }
      GQL
    end

    it 'should retrieve list of invoices' do
      result = DoubleGdpSchema.execute(invoices_query, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'invoices').length).to eql 2
      expect([invoice_one.id, invoice_two.id]).to include(result.dig('data', 'invoices', 0, 'id'))
    end

    it 'should retrieve invoice by id' do
      result = DoubleGdpSchema.execute(invoice_query, variables: { id: invoice_one.id },
                                                      context: {
                                                        current_user: user,
                                                        site_community: user.community,
                                                      }).as_json
      expect(result.dig('data', 'invoice', 'id')).to eql invoice_one.id
    end
  end
end
