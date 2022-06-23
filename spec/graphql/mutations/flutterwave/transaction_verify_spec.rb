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
        mutation TransactionVerify($transactionId: String!) {
          transactionVerify(transactionId: $transactionId) {
            success
          }
        }
      GQL
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

    before do
      ENV["#{community.name.parameterize.upcase}_FLUTTERWAVE"] = '{ "PRIVATE_KEY": "xzs-12-as"}'
      ENV['FLUTTERWAVE_TRANSACTION_VERIFY_URL'] = 'https://api.flutterwave.com/v3/transactions'
    end

    context 'when transaction succeeds' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 200, body: response_body)
      end

      it 'creates transaction log' do
        variables = { transactionId: '12345' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'transactionVerify', 'success')).to eql true
        expect(community.transaction_logs.count).to eql 1
      end
    end

    context 'when secret key is invalid' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 400, body: failed_response.to_json)
      end

      it 'raises error' do
        variables = { transactionId: '12345' }
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
        variables = { transactionId: '12345' }
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
        variables = { transactionId: '12345' }
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
