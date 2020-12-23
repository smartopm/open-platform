# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Invoice do
  describe 'Invoice queries' do
    let!(:user) { create(:user_with_community, user_type: 'admin') }
    let!(:another_user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:invoice_one) do
      create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id,
                       status: 'in_progress')
    end
    let!(:invoice_two) do
      create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id,
                       status: 'late')
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

    let(:user_invoice_query) do
      <<~GQL
        query userInvoices($userId: ID!, $limit: Int, $offset: Int) {
          userInvoices(userId: $userId, limit: $limit, offset: $offset) {
            id
            amount
          }
        }
      GQL
    end

    let(:invoice_stats) do
      <<~GQL
        query stats {
          invoiceStats {
            late
            paid
            inProgress
            cancelled
          }
        }
      GQL
    end
    let(:user_invoice_query) do
      <<~GQL
        query userInvoices($userId: ID!, $limit: Int, $offset: Int) {
          userInvoices(userId: $userId, limit: $limit, offset: $offset) {
            id
            amount
          }
        }
      GQL
    end

    it 'should retrieve list of invoices' do
      result = DoubleGdpSchema.execute(invoices_query, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'invoices').length).to eql 2
      expect([invoice_one.id, invoice_two.id]).to include(result.dig('data', 'invoices', 0, 'id'))
    end

    it 'should not retrieve list of invoices if user is not admin' do
      result = DoubleGdpSchema.execute(invoices_query, context: {
                                         current_user: another_user,
                                         site_community: another_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should  get invoice count per status' do
      result = DoubleGdpSchema.execute(invoice_stats, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'invoiceStats', 'inProgress')).to eql 1
      expect(result.dig('data', 'invoiceStats', 'late')).to eql 1
      expect(result.dig('data', 'invoiceStats', 'paid')).to eql 0
      expect(result.dig('data', 'invoiceStats', 'cancelled')).to eql 0
    end

    it 'should retrieve invoice by id' do
      result = DoubleGdpSchema.execute(invoice_query, variables: { id: invoice_one.id },
                                                      context: {
                                                        current_user: user,
                                                        site_community: user.community,
                                                      }).as_json
      expect(result.dig('data', 'invoice', 'id')).to eql invoice_one.id
    end

    it 'should retrieve list of invoices for a user' do
      variables = {
        userId: user.id,
        limit: 20,
        offset: 0,
      }
      result = DoubleGdpSchema.execute(user_invoice_query, variables: variables, context: {
                                         current_user: user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'userInvoices').length).to eql 2
      expect(result.dig('errors', 0, 'message')).to be_nil
    end

    it 'should retrieve list of invoices for a user' do
      variables = {
        userId: user.id,
        limit: 20,
        offset: 0,
      }
      result = DoubleGdpSchema.execute(user_invoice_query, variables: variables, context: {
                                         current_user: another_user,
                                         site_community: user.community,
                                       }).as_json
      expect(result.dig('data', 'userInvoices')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
