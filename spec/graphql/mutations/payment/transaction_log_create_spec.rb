# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::TransactionLog::TransactionLogCreate do
  describe 'create transaction log' do
    let!(:client_role) { create(:role, name: 'client') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:public_user_role) { create(:role, name: 'public_user') }
    let!(:permission) do
      create(:permission, module: 'transaction',
                          role: client_role,
                          permissions: %w[can_make_payment])
    end
    let!(:other_permission) do
      create(:permission, module: 'transaction',
                          role: resident_role,
                          permissions: %w[can_make_payment])
    end

    let!(:resident) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:client) { create(:user_with_community, role: client_role, user_type: 'client') }
    let!(:public_user) do
      create(:user_with_community, role: public_user_role, user_type: 'public_user')
    end

    let(:create_transaction_log) do
      <<~GQL
        mutation transactionLogCreate(
            $paidAmount: Float!
            $amount: Float!
            $currency: String!
            $invoiceNumber: String!
            $transactionId: String!
            $transactionRef: String!
            $description: String
            $accountName: String
        ) {
            transactionLogCreate(
            paidAmount: $paidAmount
            amount: $amount
            currency: $currency
            invoiceNumber: $invoiceNumber
            transactionId: $transactionId
            transactionRef: $transactionRef
            description: $description
            accountName: $accountName
            ) {
            success
            }
        }
      GQL
    end

    describe '#resolve' do
      context 'make payment' do
        it 'saves payment information for the client user' do
          variables = {
            paidAmount: 100,
            amount: 70,
            currency: 'K',
            invoiceNumber: 'D898DWS',
            transactionId: '23_423_424',
            transactionRef: '23_423_424',
            description: 'mock description',
            accountName: 'User Name',
          }
          result = DoubleGdpSchema.execute(create_transaction_log,
                                           variables: variables,
                                           context: {
                                             current_user: client,
                                             site_community: client.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'transactionLogCreate', 'success')).to eql true
        end
        it 'saves payment information for the resident user' do
          variables = {
            paidAmount: 100,
            amount: 70,
            currency: 'K',
            invoiceNumber: 'D898DWS',
            transactionId: '23_423_424',
            transactionRef: '23_423_424',
            description: 'mock description',
            accountName: 'User Name',
          }
          result = DoubleGdpSchema.execute(create_transaction_log,
                                           variables: variables,
                                           context: {
                                             current_user: resident,
                                             site_community: resident.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'transactionLogCreate', 'success')).to eql true
        end
        it 'throws an error when wrong data is provided' do
          variables = {
            paidAmount: '100',
            amount: 70,
            currency: 'K',
            invoiceNumber: 'D898DWS',
            transactionId: '23_423_424',
            transactionRef: '23_423_424',
            description: 'mock description',
            accountName: 'User Name',
          }
          result = DoubleGdpSchema.execute(create_transaction_log,
                                           variables: variables,
                                           context: {
                                             current_user: resident,
                                             site_community: resident.community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message'))
            .to include 'Variable $paidAmount of type Float! was provided invalid value'
          expect(result.dig('data', 'transactionLogCreate')).to be_nil
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not allowed to pay' do
        it 'raises unauthorized error' do
          variables = {
            paidAmount: 100,
            amount: 70,
            currency: 'K',
            invoiceNumber: 'D898DWS',
            transactionId: '23_423_424',
            transactionRef: '23_423_424',
            description: 'mock description',
            accountName: 'User Name',
          }
          result = DoubleGdpSchema.execute(create_transaction_log,
                                           variables: variables,
                                           context: {
                                             current_user: public_user,
                                             site_community: public_user.community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
