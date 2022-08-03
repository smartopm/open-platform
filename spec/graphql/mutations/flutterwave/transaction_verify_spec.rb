# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Mutations::Flutterwave::TransactionVerify do
  describe 'verify transaction' do
    let(:community) { create(:community, name: 'DoubleGDP') }
    let(:security_guard) { create(:security_guard, community: community) }
    let(:admin) { create(:admin_user, community: community) }
    let!(:permission) do
      create(:permission, module: 'transaction',
                          role: admin.role,
                          permissions: %w[can_make_payment])
    end

    let(:mutation) do
      <<~GQL
        mutation TransactionVerify($transactionId: ID, $transactionRef: String!) {
          transactionVerify(transactionId: $transactionId, transactionRef: $transactionRef) {
            status
          }
        }
      GQL
    end
    let(:transaction_ref) { '12-as-21' }
    let(:failed_response_tx_ref) { '1ad-23-23' }
    let(:cancelled_repsonse_tx_ref) { '54a-1223-1' }
    let!(:transaction_log) do
      create(:transaction_log,
             transaction_id: '12345',
             transaction_ref: transaction_ref,
             community: community,
             user: admin)
    end
    let(:failed_transaction_log) do
      create(:transaction_log,
             transaction_id: '123',
             transaction_ref: failed_response_tx_ref,
             community: community,
             user: admin,
             status: 'failed')
    end
    let(:cancelled_transaction_log) do
      create(:transaction_log,
             transaction_ref: cancelled_repsonse_tx_ref,
             community: community,
             user: admin)
    end
    let(:base_uri) { "#{ENV['FLUTTERWAVE_TRANSACTION_VERIFY_URL']}/12345/verify" }
    let(:headers) do
      {
        'Accept' => '*/*',
        'Accept-Encoding' => 'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
        'Authorization' => 'Bearer xzs-12-as',
        'Content-Type' => 'application/json',
        'Host' => 'api.flutterwave.com',
        'User-Agent' => 'Ruby',
      }
    end
    let(:response_body) { File.open('./spec/webmock/transaction_response_body.json') }

    let(:failed_response) do
      {
        status: 'error',
        message: 'Invalid secret key passed',
        data: nil,
      }
    end

    let(:wrong_transaction_id) do
      {
        status: 'error',
        message: 'No transaction was found for this id',
        data: nil,
      }
    end
    let(:private_key) { '{ "PRIVATE_KEY": "xzs-12-as"}' }

    before do
      allow_any_instance_of(ApplicationHelper).to receive(:flutterwave_keys)
        .with(community.name).and_return(JSON.parse(private_key))
      ENV['FLUTTERWAVE_TRANSACTION_VERIFY_URL'] = 'https://api.flutterwave.com/v3/transactions'
    end

    context 'when webhook response is recieved' do
      before { failed_transaction_log }

      it 'returns failed as transaction status' do
        variables = { transactionId: '123', transactionRef: failed_response_tx_ref }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'transactionVerify', 'status')).to eql 'failed'
      end
    end

    context 'when webhook response is not recieved and verification is performed through API' do
      context 'and transaction is successful' do
        before do
          stub_request(:get, base_uri)
            .with(headers: headers)
            .to_return(status: 200, body: response_body)
        end

        it 'returns successful as transaction status' do
          variables = { transactionId: '12345', transactionRef: transaction_ref }
          expect(community.transaction_logs.first.status).to eql 'pending'
          result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                             site_community: community,
                                             current_user: admin,
                                           }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'transactionVerify', 'status')).to eql 'successful'
        end
      end

      context 'and transaction is cancelled' do
        before { cancelled_transaction_log }

        it 'returns cancelled as transaction status' do
          variables = { transactionRef: cancelled_repsonse_tx_ref }
          result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                             site_community: community,
                                             current_user: admin,
                                           }).as_json
          expect(result['errors']).to be nil
          expect(result.dig('data', 'transactionVerify', 'status')).to eql 'cancelled'
        end
      end
    end

    context 'when secret key is invalid' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 400, body: failed_response.to_json)
      end

      it 'raises error' do
        variables = { transactionId: '12345', transactionRef: transaction_ref }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Invalid secret key passed'
      end
    end

    context 'when transaction id is invalid' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 400, body: wrong_transaction_id.to_json)
      end

      it 'raises error' do
        variables = { transactionId: '12345', transactionRef: transaction_ref }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'No transaction was found for this id'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = { transactionId: '12345', transactionRef: transaction_ref }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: security_guard,
                                         }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
