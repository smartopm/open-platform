# frozen_string_literal: true

require 'rails_helper'
require 'webmock/rspec'

RSpec.describe Mutations::Flutterwave::TransactionInitiate do
  describe 'generate payment link' do
    let(:community) { create(:community, name: 'DoubleGDP', hostname: 'localhost:3000') }
    let(:security_guard) { create(:security_guard, community: community) }
    let(:admin) { create(:admin_user, community: community) }
    let!(:permission) do
      create(:permission, module: 'transaction',
                          role: admin.role,
                          permissions: %w[can_make_payment])
    end
    let(:mutation) do
      <<~GQL
        mutation TransactionInitiate($amount: Float!, $invoiceNumber: String!, $description: String) {
          transactionInitiate(amount: $amount, invoiceNumber: $invoiceNumber, description: $description) {
            paymentLink
          }
        }
      GQL
    end
    let(:base_uri) { ENV['FLUTTERWAVE_PAYMENT_URL'] }
    let(:customer) do
      {
        email: admin.email,
        phonenumber: admin.phone_number,
        name: admin.name,
      }
    end
    let(:customization) do
      {
        title: I18n.t('payment.pay_for_item'),
        description: 'transaction',
        logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
      }
    end
    let(:tx_ref) { SecureRandom.urlsafe_base64(nil, false) }
    let(:payload) do
      {
        tx_ref: tx_ref,
        amount: 10.0,
        currency: 'ZMW',
        redirect_url: 'https://localhost:3000/payments/pay',
        customer: customer,
        customizations: customization,
      }
    end

    let(:headers) do
      {
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer xzs-12-as',
        'Accept' => '*/*',
        'Accept-Encoding' => 'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
        'Host' => 'api.flutterwave.com',
        'User-Agent' => 'Ruby',
      }
    end
    let(:response_body) do
      {
        status: 'success',
        message: 'Hosted Link',
        data: {
          link: 'https://ravemodal-dev.herokuapp.com/v3/hosted/pay/e5565e5a4684fe2f6d',
        },
      }
    end
    let(:failed_response) do
      {
        status: 'error',
        message: 'Invalid authorization key',
        data: nil,
      }
    end
    let(:private_key) { '{ "PRIVATE_KEY": "xzs-12-as"}' }

    before do
      allow(SecureRandom).to receive(:urlsafe_base64).and_return(tx_ref)
      allow_any_instance_of(ApplicationHelper).to receive(:flutterwave_keys)
        .with(community.name).and_return(JSON.parse(private_key))
      ENV['FLUTTERWAVE_PAYMENT_URL'] = 'https://api.flutterwave.com/v3/payments'
    end

    context 'when user makes a payment' do
      before do
        stub_request(:post, base_uri)
          .with(body: payload.to_json, headers: headers)
          .to_return(body: response_body.to_json, status: 200, headers: headers)
      end

      it 'generates payment link' do
        variables = { amount: 10, description: 'transaction', invoiceNumber: '232' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'transactionInitiate', 'paymentLink')).to_not be_nil
        expect(community.transaction_logs.first.status).to eql 'pending'
      end
    end

    context 'when admin makes a payment with invalid secret key' do
      before do
        stub_request(:post, base_uri)
          .with(body: payload.to_json, headers: headers)
          .to_return(body: failed_response.to_json)
      end

      it 'raises error' do
        variables = { amount: 10, description: 'transaction', invoiceNumber: '232' }
        result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                           site_community: community,
                                           current_user: admin,
                                         }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Invalid authorization key'
      end
    end

    context 'when user is unauthorized' do
      it 'raises  unauthorized error' do
        variables = { amount: 10, description: 'transaction', invoiceNumber: '232' }
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
