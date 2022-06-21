# frozen_string_literal: true

require 'rails_helper'
require 'flutterwave_charger'

RSpec.describe FlutterwaveCharger do
  let(:community) { create(:community, name: 'DoubleGDP') }
  let(:admin) { create(:admin_user, community: community) }
  let!(:permission) do
    create(:permission, module: 'transaction',
                        role: admin.role,
                        permissions: %w[can_make_payment])
  end

  let(:customer) do
    {
      email: admin.email,
      phonenumber: admin.phone_number,
      name: admin.name,
    }
  end
  let(:meta_data) do
    {
      invoice_number: '232',
      description: 'transaction',
      input_amount: 10.0,
    }
  end
  let(:customization) do
    {
      title: I18n.t('payment.pay_for_item'),
      description: 'transaction',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    }
  end
  let(:payload) do
    {
      tx_ref: time,
      amount: 10.0,
      currency: I18n.t("currencies.#{community.currency}"),
      redirect_url: 'http://localhost:3000/payments/pay',
      customer: customer,
      meta: meta_data,
      customizations: customization,
    }
  end
  let(:zone) { Time.zone }
  let(:time) { Time.zone.now }
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

  before do
    ENV["#{community.name.parameterize.upcase}_FLUTTERWAVE"] = '{ "PRIVATE_KEY": "xzs-12-as"}'
  end

  describe '#generate_link' do
    let(:base_uri) { 'https://api.flutterwave.com/v3/payments' }
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
    context 'when transaction initiates properly' do
      before do
        stub_request(:post, base_uri)
          .with(body: payload.to_json, headers: headers)
          .to_return(body: response_body.to_json, status: 200, headers: headers)
      end
      it 'returns successful response' do
        response = FlutterwaveCharger.generate_link(payload, community.id)
        expect(response['status']).to eql 'success'
      end
    end

    context 'when wrong auth key provided' do
      before do
        stub_request(:post, base_uri)
          .with(body: payload.to_json, headers: headers)
          .to_return(body: failed_response.to_json, status: 400)
      end
      it 'returns error' do
        response = FlutterwaveCharger.generate_link(payload, community.id)
        expect(response['status']).to eql 'error'
      end
    end
  end

  describe '#verify_transaction' do
    let(:base_uri) { 'https://api.flutterwave.com/v3/transactions/12345/verify' }
    let(:response_body) { File.open('./spec/webmock/transaction_response_body.json') }
    let(:failed_response) do
      {
        status: 'error',
        message: 'No transaction was found for this id',
        data: nil,
      }
    end
    context 'when transaction is verified' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 200, body: response_body)
      end
      it 'returns successful response' do
        response = FlutterwaveCharger.verify_transaction(12_345, community.id)
        expect(response['status']).to eql 'success'
      end
    end

    context 'when transaction id is invalid' do
      before do
        stub_request(:get, base_uri)
          .with(headers: headers)
          .to_return(status: 400, body: failed_response.to_json)
      end

      it 'returns error' do
        response = FlutterwaveCharger.verify_transaction(12_345, community.id)
        expect(response['status']).to eql 'error'
      end
    end
  end
end
